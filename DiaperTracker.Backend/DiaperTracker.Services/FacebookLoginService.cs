using DiaperTracker.Domain;
using DiaperTracker.Services.Abstractions;
using Newtonsoft.Json;

namespace DiaperTracker.Services
{
    internal class FacebookPayload
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "first_name")]
        public string FirstName { get; set; }

        [JsonProperty(PropertyName = "last_name")]
        public string LastName { get; set; }


        [JsonProperty(PropertyName = "name")]
        public string FullName { get; set; }


        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }


        [JsonProperty(PropertyName = "picture")]
        public FacebookPicture Picture { get; set; }
    }

    internal class FacebookPicture
    {
        [JsonProperty("data")]
        public FacebookPictureData Data { get; set; }
    }

    internal class FacebookPictureData
    {
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }
    }

    internal class FacebookLoginService : LoginService
    {
        private readonly HttpClient _httpClient;

        public FacebookLoginService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

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
}
