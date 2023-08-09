import { Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Api } from '../api'
import { TaskRecordDto } from '../api/ApiClient'
import Loading from '../components/shared/Loading'
import TaskFilters, { TaskFilter } from '../components/task/TaskFilters'
import TaskList from '../components/task/TaskList'
import { useData } from '../hooks/useData'
import { useMemo } from 'react'
import { parseJSON } from 'date-fns'
function saveFilters(filter: TaskFilter) {
  localStorage.setItem('task-item-filters', JSON.stringify(filter))
}
const getSavedFilters = (): TaskFilter => {
  const str = localStorage.getItem('task-item-filters')
  if (str) {
    const obj = JSON.parse(str) as TaskFilter
    if (obj.fromDate) obj.fromDate = parseJSON(obj.fromDate)
    if (obj.toDate) obj.toDate = parseJSON(obj.toDate)
    return obj
  }
  return {}
}

const getTasksWithFilters = async (filters?: TaskFilter) =>
  Api.getTasks(filters?.project?.id, filters?.taskType?.id, undefined, filters?.fromDate, filters?.toDate, 0, 50)

function MyRegistrationsPage() {
  const navigate = useNavigate()
  const defaultFilters = useMemo(getSavedFilters, [])
  const [tasks, updateFilters] = useData(getTasksWithFilters, defaultFilters)

  const handleClick = (task: TaskRecordDto) => {
    navigate(`/registrations/${task.id}`)
  }

  const onFiltersChanged = (filters: TaskFilter) => {
    updateFilters(filters)
    saveFilters(filters)
  }

  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid
        item
        xs={11}
        md={6}
      >
        <Typography variant="h5">Registrations</Typography>
        <TaskFilters
          onChange={onFiltersChanged}
          defaultFilters={defaultFilters}
        />
        <Loading {...tasks}>
          {(data) => (
            <TaskList
              tasks={data.items}
              onClick={handleClick}
            />
          )}
        </Loading>
      </Grid>
    </Grid>
  )
}

export default MyRegistrationsPage
