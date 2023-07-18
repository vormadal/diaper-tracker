namespace DiaperTracker.Domain;

public class TaskType
{
    public string Id { get; set; }

    public string ProjectId { get; set; }

    public Project Project { get; set; }

    public string DisplayName { get; set; }

    public string Icon { get; set; }

    public ICollection<TaskRecord> Records { get; set; }
}