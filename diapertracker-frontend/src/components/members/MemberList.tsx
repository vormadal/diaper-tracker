import { List, ListItem, ListItemText } from '@mui/material'
import { ProjectMemberDto } from '../../api/ApiClient'

type Props = {
  members: ProjectMemberDto[]
  show?: 'all' | 'admins' | 'members'
}

const MemberList = ({ members, show }: Props) => {
  const admins = ['all', 'admins']
  const nonAdmins = ['all', 'members']

  const filtered = members.filter(
    (x) => (admins.includes(show || 'all') && x.isAdmin) || (nonAdmins.includes(show || 'all') && !x.isAdmin)
  )
  return (
    <List dense>
      {filtered.map((x) => (
        <ListItem key={x.id}>{x.user?.fullName}</ListItem>
      ))}

      {!filtered.length && (
        <ListItem>
          <ListItemText primary="No members" />
        </ListItem>
      )}
    </List>
  )
}

export default MemberList
