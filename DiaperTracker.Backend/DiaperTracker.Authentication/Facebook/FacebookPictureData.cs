using Newtonsoft.Json;

namespace DiaperTracker.Authentication.Facebook;

internal class FacebookPictureData
{
    [JsonProperty(PropertyName = "url")]
    public string Url { get; set; }
}
