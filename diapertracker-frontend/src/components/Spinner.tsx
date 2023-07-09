import { CircularProgress } from '@mui/material'
type Props = { show?: boolean }

const Spinner = ({ show }: Props) => {
  if (!show) return null
  return <CircularProgress />
}

export default Spinner
