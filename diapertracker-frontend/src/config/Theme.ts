import { createTheme } from '@mui/material'
import { green } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    secondary: {
      main: green[500]
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: 'primary',
        variant: 'contained'
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          marginBottom: '1rem'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true
      },
      styleOverrides: {
        root: {
          marginBottom: '1rem',
          marginRight: '1rem'
        }
      }
    },
    MuiFormControl: {
      defaultProps: {
        fullWidth: true
      },
      styleOverrides: {
        root: {
          marginBottom: '1rem',
          marginRight: '1rem'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600
        }
      }
    }
  }
})
