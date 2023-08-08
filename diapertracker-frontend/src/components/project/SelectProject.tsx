import { ProjectDto } from '../../api/ApiClient'
import SelectSimple from '../shared/SelectSimple'

interface Props {
  selectedId: string
  options: ProjectDto[]
  onChange: (project?: ProjectDto) => void | Promise<void>
  label?: string
}

function SelectProject(props: Props) {
  return (
    <SelectSimple
      {...props}
      idSelector={(x) => x.id}
      labelSelector={(x) => x.name}
    />
  )
}

export default SelectProject
