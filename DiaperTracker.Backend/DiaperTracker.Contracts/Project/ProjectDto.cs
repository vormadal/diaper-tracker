using DiaperTracker.Contracts.Person;
using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Project;

public class ProjectDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public IEnumerable<TaskTypeDto> TaskTypes { get; set; } = new List<TaskTypeDto>();
}
