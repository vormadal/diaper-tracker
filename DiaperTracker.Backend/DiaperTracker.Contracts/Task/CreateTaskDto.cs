using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Task;

/// <summary>
/// DTO to be used when creating a new task
/// </summary>
public class CreateTaskDto
{
    /// <summary>
    /// Task type ID
    /// </summary>
    /// <example>10b9f582-436a-493c-ba89-78dfba79efda</example>
    /// <example>00000000-1111-2222-3333-444444444444</example>
    [Required]
    public string TypeId { get; set; }

    [Required]
    public string ProjectId { get; set; }
}
