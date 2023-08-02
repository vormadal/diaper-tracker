import { Delete } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useContext } from 'react'
import { TaskRecordDto } from '../../api/ApiClient'
import UserContext from '../../contexts/UserContext'
import SmartDate from '../shared/SmartDate'
import TaskIcon from '../taskType/TaskIcon'

interface Props {
  tasks: TaskRecordDto[]
  onDelete?: (task: TaskRecordDto) => void | Promise<void>
  onClick?: (task: TaskRecordDto) => void | Promise<void>
}

function TaskList({ tasks, onDelete, onClick }: Props) {
  const [user] = useContext(UserContext)
  const handleDelete = (task: TaskRecordDto) => () => {
    if (!onDelete) return
    onDelete(task)
  }

  const handleClick = (task: TaskRecordDto) => () => {
    if (!onClick) return
    onClick(task)
  }
  return (
    <List>
      {tasks.map((x) => (
        <ListItem
          key={x.id}
          onClick={handleClick(x)}
          secondaryAction={
            x.createdBy.id === user.id && onDelete ? (
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleDelete(x)}
              >
                <Delete />
              </IconButton>
            ) : null
          }
        >
          <ListItemIcon>
            <TaskIcon name={x.type.icon}></TaskIcon>
          </ListItemIcon>
          <ListItemText
            primary={<SmartDate date={x.date} />}
            secondary={x.createdBy.firstName || x.createdBy.fullName}
          />
        </ListItem>
      ))}
    </List>
  )
}

export default TaskList
