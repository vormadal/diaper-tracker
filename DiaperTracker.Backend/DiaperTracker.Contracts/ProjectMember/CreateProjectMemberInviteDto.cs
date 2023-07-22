using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.ProjectMember;

public class CreateProjectMemberInviteDto
{
    [Required]
    public string Email { get; set; }
}
