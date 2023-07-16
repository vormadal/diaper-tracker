import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import Login from '../components/login/Login'

type Props = {
  onLogin: () => void
}

const LandingPage = ({ onLogin }: Props) => {
  return (
    <Grid
      container
      justifyContent="center"
      rowSpacing={2}
    >
      <Grid
        item
        xs={12}
        md={6}
      >
        <Card>
          <CardMedia
            sx={{ height: 280 }}
            image="/android-chrome-512x512.png"
            title="diapertracker logo"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h4"
              component="h1"
            >
              Diaper tracker
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Wouldn't it be fun to keep track of how many times you need to change your kids diaper in a day, a week
              even a month?!
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Just remember, it is on you, if you use this app to keep score between you and your partner... and
              anything else that this app might lead to.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        item
        xs={12}
      >
        
        <Login isLoggedIn={async () => onLogin()} />
      </Grid>
    </Grid>
  )
}

export default LandingPage
