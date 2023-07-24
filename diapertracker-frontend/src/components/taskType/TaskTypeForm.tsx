import { FormEvent, useState } from 'react'
import { CreateTaskType, TaskTypeDto, UpdateTaskTypeDto } from '../../api/ApiClient'
import { Button, TextField } from '@mui/material'
import { Api } from '../../api'
import { useToast } from '../../hooks/useToast'

interface TaskTypeValues {
  displayName: string
  icon: string
}

type Props = {
  onSubmit: (values: TaskTypeValues) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  initialValues?: TaskTypeValues
  submitButtonLabel?: string
}

const TaskTypeForm = ({ submitButtonLabel, initialValues, onSubmit, onCancel }: Props) => {
  const [displayName, setName] = useState(initialValues?.displayName || '')
  const [icon, setIcon] = useState(initialValues?.icon || '')
  const [disabled, setDisabled] = useState(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    try {
      await onSubmit({ displayName, icon })
    } finally {
      setDisabled(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="displayName"
        label="Task to track"
        placeholder="Diaper change, feeding..."
        value={displayName}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        name="icon"
        label="Icon Name"
        placeholder="diaper or feeding"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        required
      />
      <Button
        disabled={disabled}
        type="submit"
      >
        {submitButtonLabel || 'Create'}
      </Button>
      {onCancel && (
        <Button
          disabled={disabled}
          color="inherit"
          variant="text"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

interface TaskTypeFormCreateProps {
  onCreated: (taskType: TaskTypeDto) => void | Promise<void>
  onCancel?: () => void
  projectId: string
}

export const TaskTypeFormCreate = ({ projectId, onCreated, onCancel }: TaskTypeFormCreateProps) => {
  const toast = useToast()
  const handleSubmit = async (values: TaskTypeValues) => {
    try {
      const created = await Api.createTaskType(
        new CreateTaskType({
          displayName: values.displayName,
          icon: values.icon,
          projectId: projectId
        })
      )
      toast.success(`${created.displayName} has been created`)
      await onCreated(created)
    } catch (e: any) {
      toast.error(e.message)
    }
  }
  return (
    <>
      <TaskTypeForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </>
  )
}

interface TaskTypeFormUpdateProps {
  onUpdated?: (taskType: TaskTypeDto) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  taskType: TaskTypeDto
}

export const TaskTypeFormUpdate = ({ taskType, onUpdated, onCancel }: TaskTypeFormUpdateProps) => {
  const toast = useToast()
  const handleSubmit = async (values: TaskTypeValues) => {
    try {
      const updated = await Api.updateTaskType(
        taskType.id,
        new UpdateTaskTypeDto({
          displayName: values.displayName,
          icon: values.icon
        })
      )
      toast.success(`${updated.displayName} has been updated`)
      onUpdated && (await onUpdated(updated))
    } catch (e: any) {
      toast.error(e.message)
    }
  }
  return (
    <>
      <TaskTypeForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValues={taskType}
        submitButtonLabel="Save"
      />
    </>
  )
}
