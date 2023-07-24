import { CircularProgress } from '@mui/material'

export enum SpinnerSize {
  'small',
  'medium',
  'large'
}
type Props = { show?: boolean; size?: SpinnerSize }

const Spinner = ({ show, size }: Props) => {
  if (!show) return null

  const sizes = {
    [SpinnerSize.small]: 20,
    [SpinnerSize.medium]: 40,
    [SpinnerSize.large]: 60
  }
  return <CircularProgress size={sizes[size !== undefined ? size : SpinnerSize.medium]} />
}

export default Spinner
