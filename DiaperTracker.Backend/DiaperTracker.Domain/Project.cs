namespace DiaperTracker.Domain;

public class Project
{
    public string Id { get; set; }

    public string Name { get; set; }

    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
    
    public ICollection<TaskType> TaskTypes { get; set; } = new List<TaskType>();
    
    public ICollection<TaskRecord> Tasks { get; set; } = new List<TaskRecord>();
}