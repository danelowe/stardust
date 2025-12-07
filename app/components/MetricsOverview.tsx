"use server"

import "server-only"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import { Activity, AlertCircle, BookMarked } from "lucide-react"
import { getHealthAggregations } from "@lib/health"
import React from "react"
import { bookmarkStore } from "@domain/bookmark/store"
import { DEMO_USER_ID } from "@lib/constants"

const userId = DEMO_USER_ID

export const MetricsOverview: React.FC = async () => {
  const bookmarks = await bookmarkStore.getBookmarksCached({ userId })
  const metrics = getHealthAggregations(bookmarks)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Total Bookmarks</span>
            <BookMarked className="h-4 w-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.total}</div>
          <CardDescription>repositories tracked</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Active</span>
            <Activity className="h-4 w-4 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {metrics.total > 0
              ? Math.round((metrics.active / metrics.total) * 100)
              : 0}
            %
          </div>
          <CardDescription>
            {metrics.active} of {metrics.total} repos
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Slowing</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">
            {metrics.total > 0
              ? Math.round((metrics.slowing / metrics.total) * 100)
              : 0}
            %
          </div>
          <CardDescription>
            {metrics.slowing} of {metrics.total} repos
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Stale</span>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">
            {metrics.total > 0
              ? Math.round((metrics.stale / metrics.total) * 100)
              : 0}
            %
          </div>
          <CardDescription>
            {metrics.stale} of {metrics.total} repos
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
