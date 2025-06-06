"use client"

import { useState, useRef, useCallback } from "react"
import { ArrowLeft, Copy } from "lucide-react"
import Link from "next/link"
import ImageUploader from "@/components/image-uploader"
import ColorPalette from "@/components/color-palette"
import TextOverlay from "@/components/text-overlay"
import Toolbar from "@/components/toolbar"
import ExportButton from "@/components/export-button"

export interface ColorInfo {
  hex: string
  rgb: [number, number, number]
}

export interface TextOverlayData {
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
}

export default function CreatePage() {
  const [image, setImage] = useState<string | null>(null)
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [textOverlay, setTextOverlay] = useState<TextOverlayData>({
    text: "",
    x: 50,
    y: 50,
    fontSize: 24,
    color: "#000000",
    fontFamily: "Inter",
  })
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = useCallback((imageUrl: string, extractedColors: ColorInfo[]) => {
    setImage(imageUrl)
    setColors(extractedColors)

    // Save to localStorage
    if (typeof window !== "undefined") {
      const history = JSON.parse(localStorage.getItem("paletteHistory") || "[]")
      const newEntry = {
        id: Date.now(),
        image: imageUrl,
        colors: extractedColors,
        timestamp: new Date().toISOString(),
      }
      const updatedHistory = [newEntry, ...history.slice(0, 4)]
      localStorage.setItem("paletteHistory", JSON.stringify(updatedHistory))
    }
  }, [])

  const handleColorSelect = useCallback(
    (color: string) => {
      if (showColorPicker) {
        setBackgroundColor(color)
        setShowColorPicker(false)
      } else {
        setTextOverlay((prev) => ({ ...prev, color }))
      }
    },
    [showColorPicker],
  )

  const copyColorsToClipboard = useCallback(async () => {
    const colorCodes = colors.map((c) => c.hex).join(", ")
    try {
      await navigator.clipboard.writeText(colorCodes)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    } catch (err) {
      console.error("Failed to copy colors:", err)
    }
  }, [colors])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Colors copied to clipboard!
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Create</h1>
        <button
          onClick={copyColorsToClipboard}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={colors.length === 0}
        >
          <Copy size={20} className={colors.length > 0 ? "text-gray-700" : "text-gray-400"} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 pb-24">
        {/* Canvas area */}
        <div
          ref={canvasRef}
          className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-lg"
          style={{ backgroundColor }}
        >
          {image ? (
            <div className="relative w-full h-full">
              <img
                src={image || "/placeholder.svg"}
                alt="Uploaded"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              {textOverlay.text && (
                <TextOverlay textData={textOverlay} onUpdate={setTextOverlay} containerRef={canvasRef} />
              )}
            </div>
          ) : (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}
        </div>

        {/* Color palette */}
        {colors.length > 0 && (
          <ColorPalette
            colors={colors}
            onColorSelect={handleColorSelect}
            selectedColor={showColorPicker ? backgroundColor : textOverlay.color}
          />
        )}

        {/* Background color picker */}
        {showColorPicker && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Background Color</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{backgroundColor}</span>
                </div>
              </div>

              {colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Palette</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setBackgroundColor(color.hex)}
                        className={`w-10 h-10 rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
                          backgroundColor === color.hex ? "ring-2 ring-blue-500 ring-offset-1" : ""
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
                <div className="flex gap-2 flex-wrap">
                  {["#ffffff", "#000000", "#f3f4f6", "#1f2937", "#fef3c7", "#ddd6fe"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-10 h-10 rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
                        backgroundColor === color ? "ring-2 ring-blue-500 ring-offset-1" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text editor */}
        {showTextEditor && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                <input
                  type="text"
                  value={textOverlay.text}
                  onChange={(e) => setTextOverlay((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter your text..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {textOverlay.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textOverlay.fontSize}
                  onChange={(e) => setTextOverlay((prev) => ({ ...prev, fontSize: Number.parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textOverlay.color}
                    onChange={(e) => setTextOverlay((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded-lg border border-gray-300"
                  />
                  <span className="flex items-center text-sm text-gray-600">{textOverlay.color}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export section */}
        {image && (
          <ExportButton
            canvasRef={canvasRef}
            image={image}
            textOverlay={textOverlay}
            backgroundColor={backgroundColor}
          />
        )}
      </div>

      {/* Bottom toolbar */}
      <Toolbar
        onImageUpload={() => {
          const input = document.createElement("input")
          input.type = "file"
          input.accept = "image/*"
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                const imageUrl = e.target?.result as string
                const img = new Image()
                img.crossOrigin = "anonymous"
                img.onload = () => {
                  const canvas = document.createElement("canvas")
                  const ctx = canvas.getContext("2d")
                  if (ctx) {
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx.drawImage(img, 0, 0)

                    const colors: ColorInfo[] = []
                    const samplePoints = [
                      [img.width * 0.2, img.height * 0.2],
                      [img.width * 0.8, img.height * 0.2],
                      [img.width * 0.5, img.height * 0.5],
                      [img.width * 0.2, img.height * 0.8],
                      [img.width * 0.8, img.height * 0.8],
                    ]

                    samplePoints.forEach(([x, y]) => {
                      const pixel = ctx.getImageData(x, y, 1, 1).data
                      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`
                      colors.push({
                        hex,
                        rgb: [pixel[0], pixel[1], pixel[2]],
                      })
                    })

                    handleImageUpload(imageUrl, colors)
                  }
                }
                img.src = imageUrl
              }
              reader.readAsDataURL(file)
            }
          }
          input.click()
        }}
        onToggleText={() => setShowTextEditor(!showTextEditor)}
        onToggleBackground={() => setShowColorPicker(!showColorPicker)}
        isTextActive={showTextEditor}
        isBackgroundActive={showColorPicker}
      />
    </div>
  )
}
