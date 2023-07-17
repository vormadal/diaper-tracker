using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Task;

public class UpdateTaskDto
{
    [Required]
    public DateTime Date { get; set; }
}
