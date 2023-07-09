using DiaperTracker.Domain;
using DiaperTracker.Services.Abstractions;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace DiaperTracker.Services
{
    internal class GoogleLoginService : LoginService
    {
        private readonly IOptions<GoogleOptions> _options;

        public GoogleLoginService(IOptions<GoogleOptions> options)
        {
            _options = options;
        }

        public async Task<ExternalLoginPayload> ValidateAsync(string token)
        {

            var payload = await GoogleJsonWebSignature.ValidateAsync(token, new ValidationSettings
            {
                Audience = new string[] { _options.Value.ClientId },
            });

            return new ExternalLoginPayload
            {
                Id = payload.Subject,
                FirstName = payload.GivenName,
                Email = payload.Email,
                FullName = payload.Name,
                ImageUrl = payload.Picture
            };
        }
    }

    public class GoogleOptions
    {
        public string ClientId { get; set; }
    }
}
