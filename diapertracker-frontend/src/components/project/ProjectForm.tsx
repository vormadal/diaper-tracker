import { Button, TextField, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'

type Props = {
  onSubmit: (name: string) => void | Promise<void>
}

const ProjectForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState('')
  const [disabled, setDisabled] = useState(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    try {
      await onSubmit(name)
    } finally {
      setDisabled(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1">Enter a name below to register</Typography>
      <TextField
        name="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button
        disabled={disabled}
        type="submit"
      >
        Register
      </Button>
    </form>
  )
}

export default ProjectForm
