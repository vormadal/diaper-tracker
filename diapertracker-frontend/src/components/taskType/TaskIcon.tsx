import {
  AcUnit,
  AccessAlarm,
  Accessible,
  AccountBalance,
  Assignment,
  BabyChangingStation,
  BedroomBaby,
  ChildFriendly,
  Crib,
  FamilyRestroom,
  Restaurant,
  Splitscreen,
  Stroller,
  Task
} from '@mui/icons-material'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

type Props = { name: string; size?: 'small' | 'medium' | 'large' | 'inherit' }

export const taskIcons = new Map<string, OverridableComponent<SvgIconTypeMap>>([
  ['diaper', BabyChangingStation],
  ['feeding', Restaurant],
  ['accessible', Accessible],
  ['ac-unit', AcUnit],
  ['access-alarm', AccessAlarm],
  ['account-balance', AccountBalance],
  ['assignment', Assignment],
  ['task', Task],
  ['split-screen', Splitscreen],
  ['crib', Crib],
  ['stroller', Stroller],
  ['child-friendly', ChildFriendly],
  ['bedroom-baby', BedroomBaby],
  ['family-restroom', FamilyRestroom]
])

const TaskIcon = ({ name, size }: Props) => {
  const Component = taskIcons.get(name) || Assignment

  return <Component fontSize={size || 'inherit'} />
}

export default TaskIcon
