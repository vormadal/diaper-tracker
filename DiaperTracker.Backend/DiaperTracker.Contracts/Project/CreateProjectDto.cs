using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Project;

public class CreateProjectDto
{
    [Required]
    public string Name { get; set; }
}
