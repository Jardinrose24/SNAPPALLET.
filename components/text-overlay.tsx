"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { TextOverlayData } from "@/app/create/page"

interface TextOverlayProps {
  textData: TextOverlayData
  onUpdate: (data: TextOverlayData) => void
  containerRef: React.RefObject<HTMLDivElement>
}

export default function TextOverlay({ textData, onUpdate, containerRef }: TextOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const textRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - textData.x,
      y: e.clientY - textData.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = ((e.clientX - dragStart.x - containerRect.left) / containerRect.width) * 100
    const newY = ((e.clientY - dragStart.y - containerRect.top) / containerRect.height) * 100

    onUpdate({
      ...textData,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - textData.x,
      y: touch.clientY - textData.y,
    })
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()

    const touch = e.touches[0]
    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = ((touch.clientX - dragStart.x - containerRect.left) / containerRect.width) * 100
    const newY = ((touch.clientY - dragStart.y - containerRect.top) / containerRect.height) * 100

    onUpdate({
      ...textData,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY)),
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
      return () => {
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, dragStart])

  return (
    <div
      ref={textRef}
      className={`absolute cursor-move select-none ${isDragging ? "z-50" : "z-10"}`}
      style={{
        left: `${textData.x}%`,
        top: `${textData.y}%`,
        fontSize: `${textData.fontSize}px`,
        color: textData.color,
        fontFamily: textData.fontFamily,
        transform: "translate(-50%, -50%)",
        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {textData.text}
    </div>
  )
}
