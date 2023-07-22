using DiaperTracker.Services.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DiaperTracker.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<ITaskTypeService, TaskTypeService>();
        services.AddScoped<ITaskRecordService, TaskRecordService>();
        services.AddScoped<IProjectService, ProjectService>();

        return services;
    }
}
