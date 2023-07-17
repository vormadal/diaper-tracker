import { Delete, ExpandMore as ExpandMoreIcon, PlusOne, Undo } from '@mui/icons-material'
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { differenceInMinutes } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { Api } from '../api'
import { CreateTaskDto, TaskTypeDto } from '../api/ApiClient'
import { useData } from '../hooks/useData'
import { ExpandMore } from './ExpandMore'
import Loading from './Loading'
import TaskIcon from './TaskIcon'
import { useToast } from '../hooks/useToast'
import UserContext from '../contexts/UserContext'
import SmartDate from './SmartDate'

type Props = { taskType: TaskTypeDto }

const BigActionCard = ({ taskType }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [tasks, updateTasks] = useData(() => Api.getTasksOfType(taskType.id, 5))
  const toast = useToast()
  const [user] = useContext(UserContext)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    const filtered =
      tasks.data?.filter((x) => differenceInMinutes(new Date(), x.date) < 1 && x.createdBy.id === user.id) || []
    setCanUndo(!!filtered.length)
  }, [tasks.data, user])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const createTask = async () => {
    setDisabled(true)
    try {
      await Api.createTask(new CreateTaskDto({ 
        typeId: taskType.id,
        projectId: taskType.projectId
      }))
      updateTasks()
      toast.success(`${taskType.displayName} er registreret`)
    } finally {
      setTimeout(() => setDisabled(false), 3000)
    }
  }

  const deleteLast = async () => {
    if (!tasks.data?.length) {
      return
    }
    setDisabled(true)
    try {
      await Api.deleteTask(tasks.data[0].id)
      updateTasks()
      toast.success('Seneste registrering er slettet')
    } finally {
      setTimeout(() => setDisabled(false), 3000)
    }
  }

  const deleteRecord = async (id: string) => {
    setDisabled(true)
    try {
      await Api.deleteTask(id)
      updateTasks()
      toast.success('Registrering er slettet')
    } finally {
      setDisabled(false)
    }
  }

  return (
    <Card>
      <CardActionArea
        onClick={createTask}
        disabled={disabled}
      >
        <CardContent>
          <Typography
            aria-description={`registrer ${taskType.displayName}`}
            textAlign={'center'}
            variant="h1"
          >
            <TaskIcon name={taskType.icon} />
            <PlusOne fontSize="inherit" />
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            textAlign={'center'}
            component="div"
          >
            {taskType.displayName}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        {canUndo && (
          <IconButton
            aria-label="undo change"
            onClick={deleteLast}
          >
            <Undo />
          </IconButton>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <CardContent>
          <List>
            <Loading {...tasks}>
              {(data) => (
                <>
                  {data.map((x) => (
                    <ListItem
                      key={x.id}
                      secondaryAction={
                        x.createdBy.id === user.id ? (
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteRecord(x.id)}
                          >
                            <Delete />
                          </IconButton>
                        ) : null
                      }
                    >
                      <ListItemIcon>
                        <TaskIcon name={taskType.icon}></TaskIcon>
                      </ListItemIcon>
                      <ListItemText
                        primary={<SmartDate date={x.date} />}
                        secondary={x.createdBy.firstName || x.createdBy.fullName}
                      />
                    </ListItem>
                  ))}
                </>
              )}
            </Loading>
          </List>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default BigActionCard
