using Newtonsoft.Json;

namespace DiaperTracker.Authentication.Facebook;

internal class FacebookPicture
{
    [JsonProperty("data")]
    public FacebookPictureData Data { get; set; }
}
