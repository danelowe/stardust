"use server"

import "server-only"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import { HealthDistribution } from "@components/analytics/HealthDistribution.client"
import { Languages } from "@components/analytics/Languages.client"
import React from "react"
import { bookmarkStore } from "@domain/bookmark/store"
import { DEMO_USER_ID } from "@lib/constants"

const userId = DEMO_USER_ID

export const Analytics: React.FC = async () => {
  const bookmarks = await bookmarkStore.getBookmarksCached({ userId })
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Health Distribution</CardTitle>
          <CardDescription>
            Status breakdown of your bookmarked repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No data yet
            </div>
          ) : (
            <HealthDistribution bookmarks={bookmarks} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
          <CardDescription>
            Top programming languages in your bookmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No data yet
            </div>
          ) : (
            <Languages bookmarks={bookmarks} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
