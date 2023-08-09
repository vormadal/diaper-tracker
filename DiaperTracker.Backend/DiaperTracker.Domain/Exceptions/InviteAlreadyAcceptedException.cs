namespace DiaperTracker.Domain.Exceptions;

public class InviteAlreadyAcceptedException : Exception
{
    public InviteAlreadyAcceptedException(string inviteId) : base($"The invite has already been accepted")
    {
        Data.Add(nameof(inviteId), inviteId);
    }
}
