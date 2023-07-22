using DiaperTracker.Authentication.Facebook;
using DiaperTracker.Authentication.Google;
using DiaperTracker.Services.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DiaperTracker.Authentication;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSocialLoginServices(this IServiceCollection services)
    {
        services.AddScoped<LoginService, FacebookLoginService>();
        services.AddScoped<LoginService, GoogleLoginService>();

        return services;
    }
}
