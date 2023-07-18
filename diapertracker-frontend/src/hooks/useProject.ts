import { useEffect, useState } from 'react'
import { Api } from '../api'
import { ProjectDto } from '../api/ApiClient'

export const useProject = (): [ProjectDto | undefined, (id: string) => Promise<void>] => {
  const [project, setProject] = useState<ProjectDto>()
  
  const updateProject = async (id: string) => {
    localStorage.setItem('selectedProject', id)
    const existing = await Api.getProject(id)
    setProject(existing)
  }

  useEffect(() => {
    const id = localStorage.getItem('selectedProject')
    if (id) {
      updateProject(id)
    }
  }, [])

  return [project, updateProject]
}
