namespace DiaperTracker.Contracts.Task;

public class TaskFilters
{
    public string? ProjectId { get; set; }

    public string? TypeId { get; set; }

    public string? UserId { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }
}
