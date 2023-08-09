import { Button, Collapse, FormLabel, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { taskIcons } from './TaskIcon'
import { useState } from 'react'

interface Props {
  selected?: string
  onChange: (icon: string) => void | Promise<void>
}

const options = Array.from(taskIcons.entries())
function TaskIconSelect({ selected, onChange }: Props) {
  const [showAll, setShowAll] = useState(false)

  return (
    <>
      <FormLabel id="task-icon-label">Icon</FormLabel>
      <Collapse
        in={showAll}
        collapsedSize={150}
      >
        <ToggleButtonGroup
          aria-labelledby="task-icon-label"
          exclusive
          fullWidth
          orientation="vertical"
          value={selected}
          onChange={(_, value) => onChange(value)}
        >
          {options.map(([key, Icon]) => (
            <ToggleButton
              key={key}
              value={key}
            >
              <Icon />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Collapse>
      <Button
        variant="text"
        fullWidth
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? 'Show less' : 'Show more'}
      </Button>
    </>
  )
}

export default TaskIconSelect
