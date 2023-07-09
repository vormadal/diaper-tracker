using Microsoft.Extensions.Options;

namespace DiaperTracker.Services.Abstractions;

public class LoginServiceFactory : ILoginServiceFactory
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOptions<GoogleOptions> _googleOptions;

    public LoginServiceFactory(IHttpClientFactory httpClientFactory, IOptions<GoogleOptions> googleOptions)
    {
        _httpClientFactory = httpClientFactory;
        _googleOptions = googleOptions;
    }
    public LoginService Get(string provider)
    {
        switch (provider.ToLower())
        {
            case "google": return new GoogleLoginService(_googleOptions);
            case "facebook": return new FacebookLoginService(_httpClientFactory.CreateClient());
            default: throw new NotImplementedException($"Login service for {provider} is not implemented");
        }
    }
}
