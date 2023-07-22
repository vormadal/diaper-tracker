namespace DiaperTracker.Domain;

public class ProjectMemberInvite
{
    public string Id { get; set; }

    public string ProjectId { get; set; }

    public Project Project { get; set; }

    public string CreatedById { get; set; }

    public virtual ApplicationUser CreatedBy { get; set; }

    public string? AcceptedById { get; set; }

    public ApplicationUser? AcceptedBy { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? AcceptedOn { get; set; }

    public DateTime? DeclinedOn { get; set; }

    public string Email { get; set; }

    public InviteStatus Status { get; set; } = InviteStatus.Pending;

    public bool IsAccepted => Status == InviteStatus.Accepted;
}

public enum InviteStatus
{
    Pending, Accepted, Declined
}
