import { FormEvent, useState } from 'react'
import { CreateTaskType, TaskTypeDto, UpdateTaskTypeDto } from '../../api/ApiClient'
import { Button, TextField } from '@mui/material'
import { Api } from '../../api'
import { useToast } from '../../hooks/useToast'
import { useRequest } from '../../hooks/useRequest'
import ErrorMessage from '../shared/ErrorMessage'

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
  const [request, send] = useRequest()
  const handleSubmit = async (values: TaskTypeValues) => {
    const { success, data: created } = await send(() =>
      Api.createTaskType(
        new CreateTaskType({
          displayName: values.displayName,
          icon: values.icon,
          projectId: projectId
        })
      )
    )

    if (success && created) {
      toast.success(`${created.displayName} has been created`)
      await onCreated(created)
    }
  }
  return (
    <>
      <ErrorMessage error={request.error} />
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
  const [request, send] = useRequest()
  const handleSubmit = async (values: TaskTypeValues) => {
    const { success, data: updated } = await send(() =>
      Api.updateTaskType(
        taskType.id,
        new UpdateTaskTypeDto({
          displayName: values.displayName,
          icon: values.icon
        })
      )
    )

    if (success && updated) {
      toast.success(`${updated.displayName} has been updated`)
      onUpdated && (await onUpdated(updated))
    }
  }
  return (
    <>
      <ErrorMessage error={request.error} />
      <TaskTypeForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValues={taskType}
        submitButtonLabel="Save"
      />
    </>
  )
}
