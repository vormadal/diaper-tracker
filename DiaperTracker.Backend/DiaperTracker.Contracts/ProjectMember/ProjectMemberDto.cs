namespace DiaperTracker.Contracts.ProjectMember;

public class ProjectMemberDto
{
    public string Id { get; set; }

    public string ProjectId { get; set; }

    public string UserId { get; set; }

    public UserDto User { get; set; }

    public bool IsAdmin { get; set; }
}
