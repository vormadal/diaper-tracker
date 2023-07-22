using DiaperTracker.Domain;
using Microsoft.AspNetCore.Identity;

namespace DiaperTracker.Persistence;

public class ApplicationUser : IdentityUser, IApplicationUser
{
    public string FirstName { get; set; }
    public string FullName { get; set; }
    public string ImageUrl { get; set; }
    public ICollection<TaskRecord> TaskRecords { get; set; }
}
