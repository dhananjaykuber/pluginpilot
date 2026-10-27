type FieldErrorProps = {
  message: string | null | undefined
}

export function FieldError({ message }: FieldErrorProps): React.JSX.Element | null {
  if (!message) {
    return null
  }

  return <p className="text-sm text-destructive">{message}</p>
}
