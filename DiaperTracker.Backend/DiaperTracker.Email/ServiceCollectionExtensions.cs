using DiaperTracker.Email.Sendgrid;
using DiaperTracker.Services.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DiaperTracker.Persistence;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddEmailServices(this IServiceCollection services)
    {
        services.AddScoped<IEmailService, SendgridEmailService>();
        return services;
    }
}
