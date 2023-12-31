import { Box, Button, Chip, Collapse, Grid, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Api } from '../../api'
import { ProjectDto, TaskTypeDto } from '../../api/ApiClient'
import { useData } from '../../hooks/useData'
import SelectProject from '../project/SelectProject'
import Loading from '../shared/Loading'
import SelectTaskType from '../taskType/SelectTaskType'

export interface TaskFilter {
  project?: ProjectDto
  taskType?: TaskTypeDto
  fromDate?: Date
  toDate?: Date
}

interface Props {
  onChange: (filters: TaskFilter) => void | Promise<void>
  defaultFilters: TaskFilter
}

const getMyProjects = () => Api.getMyProjects()
const getProjectTaskTypes = async (projectId?: string) => (projectId ? Api.getProjectTaskTypes(projectId) : [])

function TaskFilters({ onChange, defaultFilters }: Props) {
  const _onChange = useRef(onChange)
  const [projects] = useData(getMyProjects)
  const [selectedProject, setSelectedProject] = useState<ProjectDto | undefined>(defaultFilters.project)
  const [taskTypes, updateTaskTypes] = useData(getProjectTaskTypes, selectedProject?.id)
  const [selectedTaskType, setSelectedTaskType] = useState<TaskTypeDto | undefined>(defaultFilters.taskType)
  const [show, setShow] = useState(false)
  const [fromDate, setFromDate] = useState<Date | null>(defaultFilters.fromDate || null)
  const [toDate, setToDate] = useState<Date | null>(defaultFilters.toDate || null)

  const filters = [
    { id: selectedProject?.id, label: selectedProject?.name, active: !!selectedProject },
    { id: selectedTaskType?.id, label: selectedTaskType?.displayName, active: !!selectedTaskType },
    { id: 'from', label: `From ${fromDate ? format(fromDate, 'dd-MM-yyyy') : '-'}`, active: !!fromDate },
    { id: 'to', label: `To ${toDate ? format(toDate, 'dd-MM-yyyy') : '-'}`, active: !!toDate }
  ].filter((x) => x.active)

  useEffect(() => {
    if (selectedProject) {
      updateTaskTypes(selectedProject?.id)
    }
  }, [selectedProject, updateTaskTypes])

  useEffect(() => {
    const filters = {
      project: selectedProject,
      taskType: selectedProject ? selectedTaskType : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined
    }
    _onChange.current(filters)
  }, [selectedProject, selectedTaskType, fromDate, toDate])

  const clearFilters = () => {
    setSelectedProject(undefined)
    setSelectedTaskType(undefined)
    setFromDate(null)
    setToDate(null)
  }
  return (
    <Grid container>
      <Grid
        item
        xs={12}
      >
        <Collapse in={!show}>
          <Box sx={{ mb: 1 }}>
            {!filters.length && <Typography variant="body2">Showing all</Typography>}
            {filters.map((x, i) => (
              <Chip
                key={x.id}
                label={x.label}
                color="primary"
              />
            ))}
          </Box>
          <Button onClick={() => setShow(true)}>Edit Filters</Button>
        </Collapse>
        <Collapse in={show}>
          <Loading {...projects}>
            {(data) => (
              <SelectProject
                options={data}
                selectedId={selectedProject?.id ?? ''}
                onChange={setSelectedProject}
                label="Project"
              />
            )}
          </Loading>
          <Collapse in={!!selectedProject}>
            <Loading {...taskTypes}>
              {(data) => (
                <SelectTaskType
                  options={data}
                  selectedId={selectedTaskType?.id ?? ''}
                  onChange={setSelectedTaskType}
                  label="Task Type"
                />
              )}
            </Loading>
          </Collapse>
          <DatePicker
            label="From Date"
            value={fromDate || null}
            onChange={(x) => setFromDate(x)}
          />
          <DatePicker
            label="To Date"
            value={toDate || null}
            onChange={(x) => setToDate(x)}
          />
          <Button onClick={() => setShow(false)}>Close</Button>{' '}
          <Button
            variant="text"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default TaskFilters
