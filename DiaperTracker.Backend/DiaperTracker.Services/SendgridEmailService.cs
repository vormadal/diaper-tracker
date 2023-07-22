using SendGrid.Helpers.Mail;
using SendGrid;
using Microsoft.Extensions.Options;
using DiaperTracker.Services.Abstractions;

namespace DiaperTracker.Services;

public class SendgridOptions
{
    public string ApiKey { get; set; }

    public string SenderName { get; set; }

    public string SenderEmail { get; set; }
}
internal class SendgridEmailService : IEmailService
{
    private readonly IOptions<SendgridOptions> _options;
    public SendgridEmailService(IOptions<SendgridOptions> options)
    {
        _options = options;
    }
    public async Task SendEmail(string toEmail, string subject, string content)
    {
        var client = new SendGridClient(_options.Value.ApiKey);
        var from = new EmailAddress(_options.Value.SenderEmail, _options.Value.SenderName);
        var to = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, subject, content);
        var response = await client.SendEmailAsync(msg);
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(await response.Body.ReadAsStringAsync());
        }
    }
}
