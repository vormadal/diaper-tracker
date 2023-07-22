namespace DiaperTracker.Domain;

public class TaskRecord
{
    public string Id { get; set; }

    public DateTime Date { get; set; }

    public string TypeId { get; set; }

    public virtual TaskType Type { get; set; }

    public string ProjectId { get; set; }

    public virtual Project Project { get; set; }

    public string CreatedById { get; set; }

    public virtual IApplicationUser CreatedBy { get; set; }
}
