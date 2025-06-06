"use client"

import type React from "react"

import { useCallback } from "react"
import { Camera, Upload } from "lucide-react"
import type { ColorInfo } from "@/app/create/page"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string, colors: ColorInfo[]) => void
}

const extractDominantColors = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): ColorInfo[] => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const colorMap = new Map<string, number>()

  for (let i = 0; i < data.length; i += 40) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const alpha = data[i + 3]

    if (alpha < 128) continue

    const roundedR = Math.round(r / 32) * 32
    const roundedG = Math.round(g / 32) * 32
    const roundedB = Math.round(b / 32) * 32

    const colorKey = `${roundedR},${roundedG},${roundedB}`
    colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1)
  }

  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([colorKey]) => {
      const [r, g, b] = colorKey.split(",").map(Number)
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
      return {
        hex,
        rgb: [r, g, b] as [number, number, number],
      }
    })

  return sortedColors
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const handleFileSelect = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (ctx) {
            const maxSize = 200
            const scale = Math.min(maxSize / img.width, maxSize / img.height)
            canvas.width = img.width * scale
            canvas.height = img.height * scale

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            const colors = extractDominantColors(canvas, ctx)
            onImageUpload(imageUrl, colors)
          }
        }
        img.src = imageUrl
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="text-center p-8">
        <div className="mb-4">
          <Camera size={48} className="text-gray-400 mx-auto mb-2" />
          <Upload size={32} className="text-gray-400 mx-auto" />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload or capture a photo</h3>
        <p className="text-gray-500 mb-6 text-sm">Drag and drop an image or tap to select</p>

        <div className="space-y-3">
          <label className="block">
            <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            <span className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full font-medium cursor-pointer hover:bg-blue-600 transition-colors">
              Choose Photo
            </span>
          </label>

          <label className="block">
            <input type="file" accept="image/*" capture="environment" onChange={handleFileInput} className="hidden" />
            <span className="inline-block bg-gray-500 text-white px-6 py-3 rounded-full font-medium cursor-pointer hover:bg-gray-600 transition-colors">
              Take Photo
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
