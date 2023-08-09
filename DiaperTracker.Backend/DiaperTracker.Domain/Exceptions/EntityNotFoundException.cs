using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace DiaperTracker.Domain.Exceptions;


[Serializable]
public class EntityNotFoundException : Exception
{
    public EntityNotFoundException()
    {
    }

    public EntityNotFoundException(Type type, Guid id) : this(type, id.ToString()) { }

    public EntityNotFoundException(Type type, string id) : base($"Entity of type {type.Name} and ID {id} does not exist")
    {
    }

    public EntityNotFoundException(string? message) : base(message)
    {
    }

    public EntityNotFoundException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

    protected EntityNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    /// <summary>
    /// Throws an <see cref="EntityNotFoundException"/> if <paramref name="el"/> is null.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="el"></param>
    /// <param name="id"></param>
    public static void ThrowIfNull<T>([NotNull] T? el, string id)
    {
        if (el is null) Throw(typeof(T), id);
    }

    [DoesNotReturn]
    private static void Throw(Type type, string id) => throw new EntityNotFoundException(type, id);
}
