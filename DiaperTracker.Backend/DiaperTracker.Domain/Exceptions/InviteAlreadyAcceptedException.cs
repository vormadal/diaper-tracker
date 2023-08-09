namespace DiaperTracker.Domain.Exceptions;

public class InviteAlreadyAcceptedException : Exception
{
    public InviteAlreadyAcceptedException(string inviteId): base($"The invite {inviteId} has already been accepted") { }
}
