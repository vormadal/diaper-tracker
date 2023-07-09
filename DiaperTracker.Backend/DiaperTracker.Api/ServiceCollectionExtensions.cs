
using DiaperTracker.Api;
using DiaperTracker.Domain.Exceptions;
using System.Net;

namespace DiaperTracker.Presentation.OpenApi;

internal static class ServiceCollectionExtensions
{
    public static void AddExceptionMappings(this IServiceCollection services)
    {
        var options = new ExceptionMapperOptions();

        options.Map<EntityNotFoundException>(HttpStatusCode.BadRequest, x => "Entity Not Found", x => x.Message);
        options.Map<AuthenticationException>(HttpStatusCode.Unauthorized, x => "Unauthorized", x => x.Message);
        services.AddSingleton(options);
    }
}