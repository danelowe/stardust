"use server"

import "server-only"
import React from "react"
import { Empty, EmptyDescription } from "@components/ui"
import { BookmarkCard } from "@components/bookmark/BookmarkCard"
import { BookmarksError } from "@components/BookmarksError"
import { bookmarkStore } from "@domain/bookmark/store"
import { DEMO_USER_ID } from "@lib/constants"
import { ErrorBoundary } from "@components/ErrorBoundary"

export const BookmarksList: React.FC = async () => {
  return (
    <div className="space-y-4">
      <ErrorBoundary fallback={<BookmarksError />}>
        <BookmarkCards />
      </ErrorBoundary>
    </div>
  )
}

const userId = DEMO_USER_ID

const BookmarkCards: React.FC = async () => {
  const bookmarks = await bookmarkStore.getBookmarksCached({ userId })
  return bookmarks.length === 0 ? (
    <Empty>
      <EmptyDescription>
        No bookmarks yet. Add one to get started!
      </EmptyDescription>
    </Empty>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.fullName} bookmark={bookmark} />
      ))}
    </div>
  )
}
