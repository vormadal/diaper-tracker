using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts;

public class UserDto
{
    [Required]
    public string Id { get; set; }

    public string FullName { get; set; }

    public string FirstName { get; set; }
}
