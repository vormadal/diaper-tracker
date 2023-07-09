namespace DiaperTracker.Contracts;

public class UserProfile
{
    public bool IsLoggedIn { get; set; }
    public string Id { get; set; }

    public string FirstName { get; set; }

    public string FullName { get; set; }

    public string Email { get; set; }

    public string ImageUrl { get; set; }
}
