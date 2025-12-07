"use client"

import "client-only"

import { useEffect, useState } from "react"
import { Badge } from "@ui"

export const BookmarkNewBadge: React.FC<{ createdAt: Date }> = ({
  createdAt,
}) => {
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    const newForMs = createdAt.getTime() - (Date.now() - 30_000)
    const isNewNow = newForMs > 0
    if (isNewNow) {
      window.requestAnimationFrame(() => setIsNew(true))
      const timer = window.setTimeout(() => setIsNew(false), newForMs)
      return () => window.clearTimeout(timer)
    }
  }, [createdAt])

  return (
    isNew && (
      <Badge className="bg-blue-100 text-blue-900 text-xs h-4">NEW</Badge>
    )
  )
}
