using Newtonsoft.Json;

namespace DiaperTracker.Authentication.Facebook;

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
