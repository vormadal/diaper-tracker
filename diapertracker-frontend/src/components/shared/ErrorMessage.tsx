import { Alert } from '@mui/material'

interface Props {
  error?: string
}

function ErrorMessage({ error }: Props) {
  if (!error) return null

  return <Alert severity="error">{error}</Alert>
}

export default ErrorMessage
