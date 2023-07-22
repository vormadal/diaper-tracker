using DiaperTracker.Domain.Repositories;
using DiaperTracker.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DiaperTracker.Persistence;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<DiaperTrackerDatabaseContext>(config =>
        {
            config.UseNpgsql(connectionString);
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ITaskTypeRepository, TaskTypeRepository>();
        services.AddScoped<ITaskRecordRepository, TaskRecordRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProjectMemberRepository, ProjectMemberRepository>();
        services.AddScoped<IProjectMemberInviteRepository, ProjectMemberInviteRepository>();
        return services;
    }

    public static AuthenticationBuilder AddIdentity(this IServiceCollection services)
    {
        services.AddDefaultIdentity<ApplicationUser>(options =>
        {
            options.SignIn.RequireConfirmedAccount = true;
        }).AddEntityFrameworkStores<DiaperTrackerDatabaseContext>();

        services.AddIdentityServer(options =>
        {
            options.Authentication.CookieSameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode.Unspecified;
            options.Authentication.CheckSessionCookieSameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode.Unspecified;
        })
            .AddApiAuthorization<ApplicationUser, DiaperTrackerDatabaseContext>();

        return services.AddAuthentication();
    }

    public static async Task AddDatabaseMigrations(this IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<DiaperTrackerDatabaseContext>();
        await context.Database.MigrateAsync();
    }

    public static async Task AddDatabaseTestData(this IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<DiaperTrackerDatabaseContext>();
        if (context.TaskTypes.Any())
        {
            return;
        }


        //await context.TaskTypes.AddRangeAsync(new[]
        //{

        //});

        //await context.SaveChangesAsync();
    }
}
