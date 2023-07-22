namespace DiaperTracker.Domain;

public class ProjectMember
{
    public string Id { get; set; }

    public string ProjectId { get; set; }

    public virtual Project Project { get; set; }

    public string UserId { get; set; }

    public IApplicationUser User { get; set; }

    public bool IsAdmin { get; set; }
}