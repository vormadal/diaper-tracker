namespace DiaperTracker.Services.Abstractions;

public interface IEmailService
{

    public Task SendEmail(string to, string subject, string body);
}
