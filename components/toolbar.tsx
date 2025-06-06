"use client"

import { Camera, Type, Palette } from "lucide-react"

interface ToolbarProps {
  onImageUpload: () => void
  onToggleText: () => void
  onToggleBackground: () => void
  isTextActive: boolean
  isBackgroundActive: boolean
}

export default function Toolbar({
  onImageUpload,
  onToggleText,
  onToggleBackground,
  isTextActive,
  isBackgroundActive,
}: ToolbarProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-4 border border-gray-700/50 max-w-sm mx-auto">
        <div className="flex justify-around items-center">
          <button
            onClick={onImageUpload}
            className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-gray-700/50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center">
              <Camera size={20} className="text-gray-300" />
            </div>
            <span className="text-gray-300 text-xs font-medium">Image</span>
          </button>

          <button
            onClick={onToggleText}
            className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-colors ${
              isTextActive ? "bg-blue-500/50" : "hover:bg-gray-700/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isTextActive ? "bg-blue-500" : "bg-gray-700/50"
              }`}
            >
              <Type size={20} className="text-gray-300" />
            </div>
            <span className="text-gray-300 text-xs font-medium">Text</span>
          </button>

          <button
            onClick={onToggleBackground}
            className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-colors ${
              isBackgroundActive ? "bg-blue-500/50" : "hover:bg-gray-700/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isBackgroundActive ? "bg-blue-500" : "bg-gray-700/50"
              }`}
            >
              <Palette size={20} className="text-gray-300" />
            </div>
            <span className="text-gray-300 text-xs font-medium">BG</span>
          </button>
        </div>
      </div>
    </div>
  )
}
