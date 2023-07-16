import { Button } from '@mui/material'

type Props = {
  primaryColor: string
  secondaryColor: string
  children: React.ReactNode
  icon: React.ReactNode
  onClick: () => void
}

const LoginButton = ({ primaryColor, secondaryColor, children, icon, onClick }: Props) => {
  return (
    <>
      <Button
        startIcon={icon}
        fullWidth
        sx={{
          color: primaryColor,
          marginBottom: '1rem',
          borderColor: primaryColor,
          backgroundColor: secondaryColor,
          ':hover': {
            color: secondaryColor,
            backgroundColor: primaryColor
          }
        }}
        onClick={onClick}
      >
        {children}
      </Button>
    </>
  )
}

export default LoginButton
