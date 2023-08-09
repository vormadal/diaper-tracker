import { Button, Collapse, TextField } from '@mui/material'
import { FormEvent, useState } from 'react'
import { Api } from '../../api'
import { CreateProjectMemberInviteDto } from '../../api/ApiClient'
import { useToast } from '../../hooks/useToast'
import { useRequest } from '../../hooks/useRequest'
import ErrorMessage from '../shared/ErrorMessage'

type Props = {
  projectId: string
}

const SendMemberInvite = ({ projectId }: Props) => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const toast = useToast()
  const [request, send] = useRequest()

  const sendInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { success } = await send(() =>
      Api.inviteProjectMember(
        projectId,
        new CreateProjectMemberInviteDto({
          email
        })
      )
    )

    setShow(false)
    if (success) toast.success(`Invitation sent to ${email}`)
  }
  return (
    <>
      <ErrorMessage error={request.error} />
      <form onSubmit={sendInvite}>
        <Collapse in={show}>
          <TextField
            name="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter someones email"
            label="Email"
          />
          <Button type="submit">Send</Button>
          <Button
            variant="text"
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
        </Collapse>
      </form>
      {!show && <Button onClick={() => setShow(true)}>Invite member</Button>}
    </>
  )
}

export default SendMemberInvite
