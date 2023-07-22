namespace DiaperTracker.Domain;

public interface IApplicationUser
{
    public string Id { get; set; }

    public string Email { get; set; }

    public string FirstName { get; set; }

    public string FullName { get; set; }

    public string ImageUrl { get; set; }
    
    public ICollection<TaskRecord> TaskRecords { get; set; }
}
