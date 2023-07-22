namespace DiaperTracker.Contracts.ProjectMember;

public class ProjectMemberInviteResponse
{
    public string Id { get; set; }

    public InviteResponse Response { get; set; }
}

public enum InviteResponse
{
    Accepted, Declined
}
