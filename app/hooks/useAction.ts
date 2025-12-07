import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@lib/parseFormData"

export type ActionState<T> = {
  success: boolean
  input: Input<T>
  message?: string
}

/*
 * Create a consistent pattern for submitting a form and presenting validation results.
 * - Handles boilerplate for building and wrapping ActionState.
 * - Refreshes relevant parts of the page after submit (may need adjustment as patterns emerge from learning Next.js)
 */
export const useAction = <T>(
  action: (data: FormData) => Promise<ActionState<T>>,
  defaultData: T,
) => {
  const router = useRouter()
  const wrappedAction = async (_prev: ActionState<T>, data: FormData) => {
    const result = action(data)
    router.refresh()
    return result
  }
  const [state, formAction, isPending] = useActionState(
    wrappedAction,
    defaultActionState(defaultData),
  )

  return { state, action: formAction, isPending }
}

const defaultActionState = <T>(values: T) => ({
  success: false,
  input: defaultInput(values),
})

/*
 * Creates an Input object by recursively adding an empty errors array.
 *
 * Recurses and adds items/properties when the value is not a primitive.
 * We store validation details alongside values as entered into the form.
 * This helps to make clearer patterns around presenting validation errors after a form is submitted.
 */
export const defaultInput = <T>(values: T): Input<T> => {
  const errors: string[] = []
  if (Array.isArray(values)) {
    return {
      errors,
      items: values.map((v) => defaultInput(v)),
    } as Input<T>
  } else if (typeof values === "object" && values !== null) {
    return {
      errors,
      properties: Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          defaultInput(value),
        ]),
      ),
    } as Input<T>
  }

  return { value: values, errors } as Input<T>
}
