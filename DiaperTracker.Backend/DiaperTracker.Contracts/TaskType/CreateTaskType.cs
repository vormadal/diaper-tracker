using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Person;

public class CreateTaskType
{

    [Required]
    public string DisplayName { get; set; }

    [Required]
    public string Icon { get; set; }

    [Required]
    public string ProjectId { get; set; }
}