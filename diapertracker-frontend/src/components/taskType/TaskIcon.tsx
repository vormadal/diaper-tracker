import { Assignment, BabyChangingStation, Restaurant } from '@mui/icons-material'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

type Props = { name: string; size?: 'small' | 'medium' | 'large' | 'inherit' }

const options = new Map<string, OverridableComponent<SvgIconTypeMap>>([
  ['diaper', BabyChangingStation],
  ['feeding', Restaurant]
])

const TaskIcon = ({ name, size }: Props) => {
  const Component = options.get(name) || Assignment

  return <Component fontSize={size || 'inherit'} />
}

export default TaskIcon
