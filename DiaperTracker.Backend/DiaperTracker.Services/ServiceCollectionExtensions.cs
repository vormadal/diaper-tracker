using DiaperTracker.Services.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DiaperTracker.Services;

public static class ServiceCollectionExtensions
{
    public static void AddServices(this IServiceCollection services)
    {
        services.AddScoped<ITaskTypeService, TaskTypeService>();
        services.AddScoped<ITaskRecordService, TaskRecordService>();
        services.AddScoped<ILoginServiceFactory, LoginServiceFactory>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IEmailService, SendgridEmailService>();
    }
}
