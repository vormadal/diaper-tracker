import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface Props<T> {
  selectedId: string
  options: T[]
  onChange: (item?: T) => void | Promise<void>
  label?: string
  idSelector: (item: T) => string | undefined
  labelSelector: (item: T) => string
}

function SelectSimple<T>({ selectedId, options, onChange, label, idSelector, labelSelector }: Props<T>) {
  return (
    <FormControl fullWidth>
      {label && <InputLabel id="project-select-label">{label}</InputLabel>}
      <Select
        labelId="project-select-label"
        id="project-select"
        value={selectedId}
        onChange={(e) => onChange(options.find((x) => idSelector(x) === e.target.value))}
      >
        {options.map((x) => (
          <MenuItem
            key={idSelector(x)}
            selected={idSelector(x) === selectedId}
            value={idSelector(x)}
          >
            {labelSelector(x)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectSimple
