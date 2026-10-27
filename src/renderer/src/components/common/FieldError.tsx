type FieldErrorProps = {
  message: string | null | undefined
}

export function FieldError({ message }: FieldErrorProps): React.JSX.Element | null {
  if (!message) {
    return null
  }

  return <p className="text-sm whitespace-pre-line text-destructive">{message}</p>
}
