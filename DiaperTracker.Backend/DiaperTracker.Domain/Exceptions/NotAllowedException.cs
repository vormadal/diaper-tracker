﻿namespace DiaperTracker.Domain.Exceptions;

public class NotAllowedException : Exception
{
    public NotAllowedException(string message): base(message) { }
}
