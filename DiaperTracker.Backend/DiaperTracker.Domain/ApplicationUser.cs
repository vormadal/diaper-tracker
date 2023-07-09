using Microsoft.AspNetCore.Identity;

namespace DiaperTracker.Domain;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }

    public string FullName { get; set; }

    public string ImageUrl { get; set; }
    public ICollection<TaskRecord> TaskRecords { get; set; }
}
