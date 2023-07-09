namespace DiaperTracker.Domain;

public class TaskType
{
    public string Id { get; set; }

    public string DisplayName { get; set; }

    public string Icon { get; set; }

    public ICollection<TaskRecord> Records { get; set; }

    public TaskType(string displayName, string icon)
    {
        DisplayName = displayName;
        Icon = icon;
    }

}