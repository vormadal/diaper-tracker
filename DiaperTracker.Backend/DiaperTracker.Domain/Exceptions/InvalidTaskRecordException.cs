namespace DiaperTracker.Domain.Exceptions;

public class InvalidTaskRecordException : Exception
{
    public InvalidTaskRecordException(string message) : base(message) { }
}
