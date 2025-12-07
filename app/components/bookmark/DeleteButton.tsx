"use client"

import React, { useState } from "react"
import { BookmarkListView } from "@domain/bookmark/queries/getBookmarks"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@ui"
import { Trash2 } from "lucide-react"
import { deleteBookmarkAction } from "@app/actions/deleteBookmarkAction"
import { useRouter } from "next/navigation"

export const DeleteButton: React.FC<{ bookmark: BookmarkListView }> = ({
  bookmark,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const handleDelete = async () => {
    const { owner, name } = bookmark
    setIsDeleting(true)
    await deleteBookmarkAction({ owner, name })
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Remove Bookmark?</AlertDialogTitle>
        <AlertDialogDescription>
          This will remove {bookmark.fullName} from your bookmarks. You can
          re-add it later.
        </AlertDialogDescription>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Remove
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
