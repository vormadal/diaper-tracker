import { Button } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { FormEvent, useState } from 'react'
import { Api } from '../../api'
import { TaskRecordDto, UpdateTaskDto } from '../../api/ApiClient'
import { useRequest } from '../../hooks/useRequest'
import { useToast } from '../../hooks/useToast'
import ErrorMessage from '../shared/ErrorMessage'

interface TaskRecordValues {
  date: Date
}

type Props = {
  onSubmit: (values: TaskRecordValues) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  initialValues?: TaskRecordValues
  submitButtonLabel?: string
}

const TaskRecordForm = ({ submitButtonLabel, initialValues, onSubmit, onCancel }: Props) => {
  const [date, setDate] = useState(initialValues?.date || null)

  const [disabled, setDisabled] = useState(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date) return
    setDisabled(true)
    try {
      await onSubmit({ date })
    } finally {
      setDisabled(false)
    }
  }

  const handleDateChange = (value: Date | null) => {
    setDate(value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <DateTimePicker
        label="Date"
        value={date}
        ampm={false}
        onChange={handleDateChange}
        disableFuture
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

interface TaskRecordFormUpdateProps {
  onUpdated?: (TaskRecord: TaskRecordDto) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  taskRecord: TaskRecordDto
}

export const TaskRecordFormUpdate = ({ taskRecord, onUpdated, onCancel }: TaskRecordFormUpdateProps) => {
  const toast = useToast()
  const [request, send] = useRequest()
  const handleSubmit = async (values: TaskRecordValues) => {
    const { success, data: updated } = await send(() =>
      Api.updateTask(
        taskRecord.id,
        new UpdateTaskDto({
          date: values.date
        })
      )
    )

    if (success && updated) {
      toast.success(`The registration has been updated`)
      onUpdated && (await onUpdated(updated))
    }
  }
  return (
    <>
      <ErrorMessage error={request.error} />
      <TaskRecordForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValues={taskRecord}
        submitButtonLabel="Save"
      />
    </>
  )
}
