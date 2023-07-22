using DiaperTracker.Domain;
using DiaperTracker.Services.Abstractions;
using Newtonsoft.Json;

namespace DiaperTracker.Authentication.Facebook;

internal class FacebookLoginService : LoginService
{
    private readonly HttpClient _httpClient;

    public FacebookLoginService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public string Name => "facebook";

    public async Task<ExternalLoginPayload> ValidateAsync(string token)
    {
        var me = await Request<FacebookPayload>($"https://graph.facebook.com/v8.0/me?access_token={token}");
        var payload = await Request<FacebookPayload>($"https://graph.facebook.com/v8.0/{me.Id}?fields=id,first_name,last_name,name,email,picture&access_token={token}");

        return new ExternalLoginPayload
        {
            Id = payload.Id,
            Email = payload.Email,
            FullName = payload.FullName,
            FirstName = payload.FirstName ?? payload.FullName,
            ImageUrl = payload.Picture?.Data?.Url ?? string.Empty,
        };
    }

    private async Task<T> Request<T>(string url)
    {
        var response = await _httpClient.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<T>(content)!;
    }
}
