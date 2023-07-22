using DiaperTracker.Domain;
using DiaperTracker.Services.Abstractions;
using Google.Apis.PeopleService.v1;
using Google.Apis.Services;
using Microsoft.Extensions.Options;

namespace DiaperTracker.Authentication.Google;

internal class GoogleLoginService : LoginService
{
    public string Name => "google";

    private readonly IOptions<GoogleOptions> _options;

    public GoogleLoginService(IOptions<GoogleOptions> options)
    {
        _options = options;
    }

    public Task<ExternalLoginPayload> ValidateAsync(string token)
    {
        
        var service = new PeopleServiceService(new BaseClientService.Initializer
        {
            ApiKey = _options.Value.ApiKey
        });

        var request = service.People.Get("people/me");
        request.PersonFields = "names,emailAddresses,photos,externalIds";
        request.AccessToken = token;
        var profile = request.Execute();

        return Task.FromResult(new ExternalLoginPayload
        {
            Email = profile.EmailAddresses.First().Value,
            FirstName = profile.Names.First().GivenName,
            FullName = profile.Names.First().DisplayName,
            ImageUrl = profile.Photos.First().Url,
            // the resourcename usually looks something like this "people/123123123" we only want the last part
            Id = profile.ResourceName.Split('/').Last()
        });
    }
}
