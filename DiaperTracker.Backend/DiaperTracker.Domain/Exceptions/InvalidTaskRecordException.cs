namespace DiaperTracker.Domain.Exceptions;

public class InvalidTaskRecordException : Exception
{
    public InvalidTaskRecordException(string message, params (string key, object? value)[] data) : base(message)
    {
        foreach (var (key, value) in data)
        {
            Data.Add(key, value);
        }
    }
}
