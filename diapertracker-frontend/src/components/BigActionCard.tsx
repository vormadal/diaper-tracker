import { ExpandMore as ExpandMoreIcon, PlusOne, Undo } from '@mui/icons-material'
import { Card, CardActionArea, CardActions, CardContent, Chip, Collapse, IconButton, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loading } from '@vormadal/react-mui'
import { differenceInMinutes, endOfToday, startOfToday } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Api } from '../api'
import {
  CreateTaskDto,
  ITaskRecordDtoPagedList,
  TaskRecordDto,
  TaskRecordDtoPagedList,
  TaskTypeDto,
  UserDto
} from '../api/ApiClient'
import UserContext from '../contexts/UserContext'
import { ExpandMore } from './shared/ExpandMore'
import TaskList from './task/TaskList'
import TaskIcon from './taskType/TaskIcon'

type Props = { taskType: TaskTypeDto }

const BigActionCard = ({ taskType }: Props) => {
  const [user] = useContext(UserContext)
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const tasks = useQuery({
    queryKey: ['tasks', taskType.id],
    queryFn: () => Api.getTasksOfType(taskType.id, undefined, 0, 5)
  })
  const taskCountToday = useQuery({
    queryKey: ['task-count', taskType.id],
    queryFn: () => Api.getTasks(taskType.projectId, taskType.id, undefined, startOfToday(), endOfToday(), 0, 0)
  })
  const deleteTask = useMutation({
    mutationFn: (id: string) => Api.deleteTask(id),
    onMutate: async (id) => {
      queryClient.setQueryData<ITaskRecordDtoPagedList>(
        ['tasks', taskType.id],
        (old) =>
          new TaskRecordDtoPagedList({
            count: old?.count ?? 0 + 1,
            total: old?.total ?? 0 + 1,
            page: old?.page ?? 0,
            items: (old?.items ?? []).filter((x) => x.id !== id)
          })
      )
    }
  })
  const createTask = useMutation({
    mutationFn: async (body: CreateTaskDto) => Api.createTask(body),
    onMutate: async (task) => {
      const optimisticTask = new TaskRecordDto({
        ...task!,
        createdBy: new UserDto({
          fullName: user.fullName!,
          id: user.id!,
          firstName: user.firstName
        }),
        date: new Date(),
        type: taskType,
        id: 'optimistic'
      })

      queryClient.setQueryData<ITaskRecordDtoPagedList>(
        ['tasks', taskType.id],
        (old) =>
          new TaskRecordDtoPagedList({
            count: old?.count ?? 0 + 1,
            total: old?.total ?? 0 + 1,
            page: old?.page ?? 0,
            items: [optimisticTask, ...(old?.items ?? [])]
          })
      )

      return { optimisticTask }
    },
    onSuccess: (result, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['task-count', taskType.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks', taskType.id] })
      queryClient.setQueryData<ITaskRecordDtoPagedList>(
        ['tasks', taskType.id],
        (old) =>
          new TaskRecordDtoPagedList({
            ...old!,
            items: old!.items.map((x) => (x.id === context?.optimisticTask.id ? result : x))
          })
      )
    }
  })

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

  const deleteLast = async () => {
    if (!tasks.data?.items.length) {
      return
    }

    const id = tasks.data.items[0].id
    deleteTask.mutateAsync(id)
  }

  return (
    <Card sx={{ marginBottom: '1rem' }}>
      <CardActionArea
        onClick={() =>
          createTask.mutateAsync(
            new CreateTaskDto({
              projectId: taskType.projectId,
              typeId: taskType.id
            })
          )
        }
        disabled={createTask.isLoading}
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
              label={`Today: ${taskCountToday.data?.total || '0'}`}
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
          <Loading
            data={tasks.data}
            loading={tasks.isLoading}
            error={tasks.error as string}
          >
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
