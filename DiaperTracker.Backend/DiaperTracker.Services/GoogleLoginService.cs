using DiaperTracker.Domain;
using DiaperTracker.Services.Abstractions;
using Google.Apis.PeopleService.v1;
using Microsoft.Extensions.Options;

namespace DiaperTracker.Services
{
    internal class GoogleLoginService : LoginService
    {
        private readonly IOptions<GoogleOptions> _options;

        public GoogleLoginService(IOptions<GoogleOptions> options)
        {
            _options = options;
        }

        public Task<ExternalLoginPayload> ValidateAsync(string token)
        {
            var service = new PeopleServiceService(new Google.Apis.Services.BaseClientService.Initializer
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

    public class GoogleOptions
    {
        public string ApiKey { get; internal set; }
    }
}
