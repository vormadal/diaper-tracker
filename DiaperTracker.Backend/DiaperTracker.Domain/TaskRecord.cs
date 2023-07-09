namespace DiaperTracker.Domain;

public class TaskRecord
{
    public string Id { get; set; }

    public DateTime Date { get; set; }

    public string TypeId { get; set; }

    public virtual TaskType Type { get; set; }

    public string CreatedById { get; set; }

    public virtual ApplicationUser CreatedBy { get; set; }
}
