import { TaskTypeDto } from '../../api/ApiClient'
import SelectSimple from '../shared/SelectSimple'

interface Props {
  selectedId: string
  options: TaskTypeDto[]
  onChange: (project?: TaskTypeDto) => void | Promise<void>
  label?: string
}

function SelectTaskType(props: Props) {
  return (
    <SelectSimple
      {...props}
      idSelector={(x) => x.id}
      labelSelector={(x) => x.displayName}
    />
  )
}

export default SelectTaskType
