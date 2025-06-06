import Link from "next/link"
import { Plus, ImageIcon, Type, Palette } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 via-purple-300/30 to-blue-300/30 backdrop-blur-3xl"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">SnapPalette</h1>
          <p className="text-gray-600 text-lg">Extract colors, create stories</p>
        </div>

        {/* Create button */}
        <Link href="/create" className="w-full">
          <button className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl py-6 px-8 flex items-center justify-center gap-3 text-white font-semibold text-xl shadow-lg hover:bg-white/30 transition-all duration-300 active:scale-95">
            <Plus size={28} strokeWidth={2.5} />
            Create Your Story
          </button>
        </Link>
      </div>

      {/* Bottom toolbar */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-gray-700/50">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center">
                <ImageIcon size={24} className="text-gray-300" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Image</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center">
                <Type size={24} className="text-gray-300" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Text</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center">
                <Palette size={24} className="text-gray-300" />
              </div>
              <span className="text-gray-300 text-sm font-medium">BG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
