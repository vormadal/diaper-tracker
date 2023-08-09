namespace DiaperTracker.Domain.Exceptions;

public class NotAllowedException : Exception
{
    public NotAllowedException(string message, params (string key, object? value)[] data) : base(message)
    {
        foreach (var (key, value) in data)
        {
            Data.Add(key, value);
        }
    }
}
