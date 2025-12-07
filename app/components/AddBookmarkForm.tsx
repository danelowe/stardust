"use client"

import React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Textarea,
} from "@components/ui"
import { addBookmarkAction } from "@app/actions/addBookmarkAction"
import { useAction } from "@app/hooks/useAction"

export const AddBookmarkForm: React.FC = () => {
  const { state, action, isPending } = useAction(addBookmarkAction, {
    repository: "",
    note: "",
  })
  const input = state.input.properties

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Repository</CardTitle>
        <CardDescription>
          Bookmark a GitHub repository to track its health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="repository">Repository Name</FieldLabel>
            <Input
              name="repository"
              id="repository"
              defaultValue={input.repository.value}
              placeholder="e.g., NixOS/nixpkgs"
              disabled={isPending}
              aria-invalid={!!input.repository.errors.length}
              required
            />
            {input.repository.errors.map((error) => (
              <FieldError key={error}>{error}</FieldError>
            ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="note">Personal Note (Optional)</FieldLabel>
            <Textarea
              name="note"
              id="note"
              defaultValue={input.note.value}
              placeholder="Why are you bookmarking this? e.g., 'Using for my web framework'"
              disabled={isPending}
              aria-invalid={!!input.note.errors.length}
              className="resize-none"
              rows={3}
            />
            {input.note.errors.map((error) => (
              <FieldError key={error}>{error}</FieldError>
            ))}
          </Field>
          {state.input.errors.map((error) => (
            <Alert key={error} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}

          {state.success && (
            <Alert className="border-green-200 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Repository bookmarked successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Bookmark"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
