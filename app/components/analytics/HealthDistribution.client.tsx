"use client"

import "client-only"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { BookmarkListView } from "@domain/bookmark/queries/getBookmarks"
import React, { useMemo } from "react"
import { getHealthAggregations } from "@lib/health"

export const HealthDistribution: React.FC<{
  bookmarks: BookmarkListView[]
}> = ({ bookmarks }) => {
  const healthData = useMemo(() => getHealthData(bookmarks), [bookmarks])
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={healthData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name} (${value})`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {healthData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

const getHealthData = (bookmarks: BookmarkListView[]) => {
  const { active, slowing, stale } = getHealthAggregations(bookmarks)

  return [
    { name: "Active", value: active, fill: "#10b981" },
    { name: "Slowing", value: slowing, fill: "#f59e0b" },
    { name: "Stale", value: stale, fill: "#ef4444" },
  ]
}
