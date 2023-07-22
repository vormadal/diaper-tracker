import { FormEvent, useState } from 'react'
import { CreateTaskType } from '../../api/ApiClient'
import { Button, TextField } from '@mui/material'

type Props = {
  projectId: string
  onSubmit: (taskType: CreateTaskType) => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

const TaskTypeForm = ({ projectId, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [disabled, setDisabled] = useState(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    try {
      await onSubmit(
        new CreateTaskType({
          displayName: name,
          icon: icon,
          projectId: projectId
        })
      )
    } finally {
      setDisabled(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="displayName"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        name="icon"
        label="Icon Name"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        required
      />
      <Button
        disabled={disabled}
        type="submit"
      >
        Create
      </Button>
      {onCancel && (
        <Button
          disabled={disabled}
          color="inherit"
          variant='text'
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

export default TaskTypeForm
