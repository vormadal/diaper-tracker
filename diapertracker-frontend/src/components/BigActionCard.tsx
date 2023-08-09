import { ExpandMore as ExpandMoreIcon, PlusOne, Undo } from '@mui/icons-material'
import { Card, CardActionArea, CardActions, CardContent, Chip, Collapse, IconButton, Typography } from '@mui/material'
import { differenceInMinutes, endOfToday, startOfToday } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Api } from '../api'
import { CreateTaskDto, TaskRecordDtoPagedList, TaskTypeDto } from '../api/ApiClient'
import UserContext from '../contexts/UserContext'
import { useData } from '../hooks/useData'
import { useRequest } from '../hooks/useRequest'
import { useToast } from '../hooks/useToast'
import { ExpandMore } from './shared/ExpandMore'
import Loading from './shared/Loading'
import TaskList from './task/TaskList'
import TaskIcon from './taskType/TaskIcon'

type Props = { taskType: TaskTypeDto }

const getTasks = async (typeId?: string): Promise<TaskRecordDtoPagedList | undefined> =>
  typeId ? Api.getTasksOfType(typeId, undefined, 0, 5) : undefined

const getTasksToday = async (taskType?: TaskTypeDto): Promise<TaskRecordDtoPagedList | undefined> =>
  taskType ? Api.getTasks(taskType.projectId, taskType.id, undefined, startOfToday(), endOfToday(), 0, 0) : undefined

const BigActionCard = ({ taskType }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [request, send] = useRequest()
  const [tasks, updateTasks] = useData(getTasks, taskType.id)
  const [tasksToday, updateTasksToday] = useData(getTasksToday, taskType)
  const toast = useToast()
  const [user] = useContext(UserContext)
  const [canUndo, setCanUndo] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const filtered =
      tasks.data?.items.filter((x) => differenceInMinutes(new Date(), x.date) < 1 && x.createdBy.id === user.id) || []
    setCanUndo(!!filtered.length)
  }, [tasks.data, user])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const createTask = async () => {
    const { success } = await send(() =>
      Api.createTask(
        new CreateTaskDto({
          typeId: taskType.id,
          projectId: taskType.projectId
        })
      )
    )

    if (!success) return

    updateTasks()
    updateTasksToday()
    toast.success(`${taskType.displayName} er registreret`)
  }

  const deleteLast = async () => {
    if (!tasks.data?.items.length) {
      return
    }

    const id = tasks.data.items[0].id
    const { success } = await send(() => Api.deleteTask(id))

    if (!success) return

    updateTasks()
    updateTasksToday()
    toast.success('Seneste registrering er slettet')
  }

  return (
    <Card sx={{ marginBottom: '1rem' }}>
      <CardActionArea
        onClick={createTask}
        disabled={request.loading}
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
            {taskType.displayName}{' '}
            <Chip
              label={`Today: ${tasksToday.data?.total || '0'}`}
              color="primary"
            ></Chip>
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
          <Loading {...tasks}>
            {(data) => (
              <TaskList
                tasks={data.items}
                onClick={(task) => navigate(`/registrations/${task.id}`)}
              />
            )}
          </Loading>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default BigActionCard
