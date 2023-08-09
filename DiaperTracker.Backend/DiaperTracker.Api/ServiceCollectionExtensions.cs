
using DiaperTracker.Api;
using DiaperTracker.Domain.Exceptions;
using System.Net;

namespace DiaperTracker.Presentation.OpenApi;

internal static class ServiceCollectionExtensions
{
    public static IServiceCollection AddExceptionMappings(this IServiceCollection services, bool includeStackTrace = false)
    {
        var options = new ExceptionMapperOptions(includeStackTrace);

        options.Map<EntityNotFoundException>(HttpStatusCode.BadRequest, x => "Entity not found");
        options.Map<AuthenticationException>(HttpStatusCode.Unauthorized, x => "Unauthorized access");
        options.Map<ArgumentException>(HttpStatusCode.BadRequest, x => "Bad arguments");
        options.Map<MissingLoginProviderException>(HttpStatusCode.BadRequest, x => "Missing login provider");
        options.Map<NotAllowedException>(HttpStatusCode.Forbidden, x => "Not allowed");
        options.Map<InviteAlreadyAcceptedException>(HttpStatusCode.BadRequest, x => "Invite already accepted");
        services.AddSingleton(options);

        return services;
    }
}