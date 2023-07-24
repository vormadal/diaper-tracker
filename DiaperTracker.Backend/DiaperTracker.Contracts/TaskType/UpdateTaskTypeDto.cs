using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.TaskType;

public class UpdateTaskTypeDto
{
    [Required]
    public string DisplayName { get; set; }

    [Required]
    public string Icon { get; set; }
}
