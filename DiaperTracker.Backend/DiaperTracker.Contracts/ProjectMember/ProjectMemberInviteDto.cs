using DiaperTracker.Contracts.Project;
using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.ProjectMember;

public class ProjectMemberInviteDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public ProjectDto Project { get; set; }

    [Required]
    public UserDto CreatedBy { get; set; }

    [Required]
    public DateTime CreatedOn { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public bool IsAccepted { get; set; }

    public string Token { get; set; }
}
