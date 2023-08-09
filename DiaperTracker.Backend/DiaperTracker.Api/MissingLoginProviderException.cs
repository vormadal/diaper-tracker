namespace DiaperTracker.Api
{
    public class MissingLoginProviderException : Exception
    {
        public MissingLoginProviderException(string provider) : base($"No login service configured for '{provider}'") { }
    }
}
