using DiaperTracker.Contracts.Person;
using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Task;

/// <summary>
/// A representation of a persisted task including type details
/// </summary>
public class TaskRecordDto
{
    /// <summary>
    /// The id of the task
    /// </summary>
    /// <example>10b9f582-436a-493c-ba89-78dfba79efda</example>
    [Required]
    public string Id { get; set; }

    [Required]
    public TaskTypeDto Type { get; set; }

    [Required]
    public UserDto CreatedBy { get; set; }

    [Required]
    public DateTime Date { get; set; }
}
