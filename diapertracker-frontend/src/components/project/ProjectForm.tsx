import { Button, TextField, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from '../../api/ApiClient'
import { Api } from '../../api'
import { useToast } from '../../hooks/useToast'

interface ProjectValues {
  name: string
}

type Props = {
  onSubmit: (project: ProjectValues) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  initialValue?: ProjectValues
  submitButtonLabel?: string
}

const ProjectForm = ({ initialValue, submitButtonLabel, onCancel, onSubmit }: Props) => {
  const [name, setName] = useState(initialValue?.name || '')
  const [disabled, setDisabled] = useState(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    try {
      await onSubmit({ name })
    } finally {
      setDisabled(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button
        disabled={disabled || name === (initialValue?.name || '')}
        type="submit"
      >
        {submitButtonLabel || 'Create'}
      </Button>
      {onCancel && (
        <Button
          variant="text"
          color="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

interface ProjectFormCreateProps {
  onCreated: (project: ProjectDto) => void | Promise<void>
}

export const ProjectFormCreate = ({ onCreated }: ProjectFormCreateProps) => {
  const toast = useToast()
  const handleSubmit = async (project: ProjectValues) => {
    try {
      const created = await Api.createProject(new CreateProjectDto(project))
      toast.success(`${created.name} has been registered`)
      await onCreated(created)
    } catch (e: any) {
      toast.error(e.message)
    }
  }
  return (
    <>
      <Typography variant="body1">Enter a name below to create a new project</Typography>
      <ProjectForm onSubmit={handleSubmit} />
    </>
  )
}

interface ProjectFormUpdateProps {
  onUpdated: (project: ProjectDto) => void | Promise<void>
  onCancel?: () => void | Promise<void>
  project: ProjectDto
}

export const ProjectFormUpdate = ({ project, onUpdated, onCancel }: ProjectFormUpdateProps) => {
  const toast = useToast()
  const handleSubmit = async (values: ProjectValues) => {
    try {
      const updated = await Api.updateProject(project.id, new UpdateProjectDto(values))
      toast.success(`${updated.name} has been updated`)
      await onUpdated(updated)
    } catch (e: any) {
      toast.error(e.message)
    }
  }
  return (
    <>
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        initialValue={project}
        submitButtonLabel="Save"
      />
    </>
  )
}
