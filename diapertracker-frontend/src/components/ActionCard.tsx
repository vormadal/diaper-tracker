import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Typography
} from '@mui/material'
import { BabyChangingStation, Restaurant, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { ExpandMore } from './ExpandMore'
import { useState } from 'react'
type Props = { icon: React.ReactNode }

const ActionCard = ({ icon }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <Card>
      <CardActionArea>
        <CardMedia
          height="140"
          component="img"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
          >
            Baby Name
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton aria-label="register diaper change">
          <BabyChangingStation />
        </IconButton>
        <IconButton aria-label="register baby feeding">
          <Restaurant />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <CardContent>
            Test
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default ActionCard
