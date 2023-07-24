using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Project;

public class UpdateProjectDto
{
    [Required]
    public string Name { get; set; }
}
