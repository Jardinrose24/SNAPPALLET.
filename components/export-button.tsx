"use client"

import type React from "react"

import { useCallback } from "react"
import { Download } from "lucide-react"
import type { TextOverlayData } from "@/app/create/page"

interface ExportButtonProps {
  canvasRef: React.RefObject<HTMLDivElement>
  image: string
  textOverlay: TextOverlayData
  backgroundColor: string
}

export default function ExportButton({ canvasRef, image, textOverlay, backgroundColor }: ExportButtonProps) {
  const exportImage = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const size = 1080
      canvas.width = size
      canvas.height = size

      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, size, size)

      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = image
      })

      const imgAspect = img.width / img.height
      let drawWidth = size
      let drawHeight = size
      let offsetX = 0
      let offsetY = 0

      if (imgAspect > 1) {
        drawHeight = size / imgAspect
        offsetY = (size - drawHeight) / 2
      } else {
        drawWidth = size * imgAspect
        offsetX = (size - drawWidth) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      if (textOverlay.text) {
        ctx.font = `${textOverlay.fontSize * 2}px ${textOverlay.fontFamily}`
        ctx.fillStyle = textOverlay.color
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        const textX = (textOverlay.x / 100) * size
        const textY = (textOverlay.y / 100) * size

        ctx.fillText(textOverlay.text, textX, textY)
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `snappalette-${Date.now()}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        },
        "image/png",
        1.0,
      )
    } catch (error) {
      console.error("Export failed:", error)
    }
  }, [canvasRef, image, textOverlay, backgroundColor])

  return (
    <button
      onClick={exportImage}
      className="w-full bg-blue-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors shadow-lg"
    >
      <Download size={24} />
      Save Image
    </button>
  )
}
