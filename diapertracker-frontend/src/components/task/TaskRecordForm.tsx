import { Button, TextField } from '@mui/material'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react'
import { Api } from '../../api'
import { TaskRecordDto, UpdateTaskDto } from '../../api/ApiClient'
import { useToast } from '../../hooks/useToast'
import { inputFormatDate } from '../../utils/DateUtils'

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

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber
    setDate(value ? new Date(value) : null)
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="date"
        label="Date"
        type="datetime-local"
        value={inputFormatDate(date)}
        onChange={handleDateChange}
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

interface TaskRecordFormUpdateProps {
  onUpdated?: (TaskRecord: TaskRecordDto) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  taskRecord: TaskRecordDto
}

export const TaskRecordFormUpdate = ({ taskRecord, onUpdated, onCancel }: TaskRecordFormUpdateProps) => {
  const toast = useToast()
  const handleSubmit = async (values: TaskRecordValues) => {
    try {
      const updated = await Api.updateTask(
        taskRecord.id,
        new UpdateTaskDto({
          date: values.date
        })
      )
      toast.success(`The registration has been updated`)
      onUpdated && (await onUpdated(updated))
    } catch (e: any) {
      toast.error(e.message)
    }
  }
  return (
    <>
      <TaskRecordForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValues={taskRecord}
        submitButtonLabel="Save"
      />
    </>
  )
}
