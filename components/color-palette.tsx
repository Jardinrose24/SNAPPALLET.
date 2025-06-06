"use client"

import type { ColorInfo } from "@/app/create/page"

interface ColorPaletteProps {
  colors: ColorInfo[]
  onColorSelect: (color: string) => void
  selectedColor?: string
}

export default function ColorPalette({ colors, onColorSelect, selectedColor }: ColorPaletteProps) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Color Palette</h3>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorSelect(color.hex)}
            className={`flex-shrink-0 w-16 h-16 rounded-xl shadow-md transition-all duration-200 hover:scale-105 ${
              selectedColor === color.hex ? "ring-4 ring-blue-500 ring-offset-2" : ""
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <span className="sr-only">{color.hex}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <span key={index} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-md text-gray-700">
            {color.hex}
          </span>
        ))}
      </div>
    </div>
  )
}
