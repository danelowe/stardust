"use client"

import "client-only"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { BookmarkListView } from "@domain/bookmark/queries/getBookmarks"
import React, { useMemo } from "react"
import { countBy } from "es-toolkit"

export const Languages: React.FC<{ bookmarks: BookmarkListView[] }> = ({
  bookmarks,
}) => {
  const languageData = useMemo(() => getLanguageData(bookmarks), [bookmarks])
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={languageData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const getLanguageData = (bookmarks: BookmarkListView[]) => {
  const languages = countBy(bookmarks, (b) => b.language || "Unknown")

  return Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}
