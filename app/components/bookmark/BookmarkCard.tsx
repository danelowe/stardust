"use server"

import "server-only"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { AlertCircle, ExternalLink, Star } from "lucide-react"
import React from "react"
import { BookmarkListView } from "@domain/bookmark/queries/getBookmarks"
import { BookmarkNewBadge } from "@components/bookmark/BookmarkNewBadge"
import { getHealthStatus } from "@lib/health"
import { DeleteButton } from "@components/bookmark/DeleteButton"
import { HealthIndicator } from "@components/bookmark/HealthIndicator"

export const BookmarkCard: React.FC<{ bookmark: BookmarkListView }> = async ({
  bookmark,
}) => {
  const {
    lastCommitAt,
    createdAt,
    openIssuesCount,
    htmlUrl,
    fullName,
    description,
    note,
    language,
    starsCount,
  } = bookmark

  const health = getHealthStatus(bookmark)

  return (
    <Card className="flex flex-col overflow-hidden gap-0">
      <CardHeader>
        <div className="flex flex-row gap-1 justify-between items-center">
          <a
            href={htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold hover:text-primary transition-colors flex items-center gap-2"
          >
            {fullName}
            <ExternalLink className="h-4 w-4" />
          </a>
          <div className="flex flex-row items-center gap-2">
            <BookmarkNewBadge createdAt={createdAt} />
            <DeleteButton bookmark={bookmark} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3 py-2">
          <HealthIndicator health={health} />
          {/* TODO: SSR is using a different locale to browser */}
          {!!lastCommitAt && (
            <span
              className="text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              Last commit {formatRelativeDate(lastCommitAt)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{starsCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {openIssuesCount} issues
            </span>
          </div>
          {language && <Badge variant="outline">{language}</Badge>}
        </div>

        {note && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
            {note}
          </div>
        )}

        <CardDescription>{description || "No description"}</CardDescription>
      </CardContent>
    </Card>
  )
}

const formatRelativeDate = (date: Date): string => {
  const now = new Date()
  const seconds = (now.getTime() - date.getTime()) / 1000

  if (seconds < 60) {
    return "just now"
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`
  } else if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return date.toLocaleDateString()
}
