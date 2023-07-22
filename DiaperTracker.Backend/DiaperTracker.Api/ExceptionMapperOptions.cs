using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace DiaperTracker.Presentation.OpenApi;

public class ExceptionMapperOptions
{
    private readonly Dictionary<Type, IExceptionMapping> _mappings = new Dictionary<Type, IExceptionMapping>();
    private readonly ExceptionMapping<Exception> _defaultMapping = new ExceptionMapping<Exception>
    {
        Type = typeof(Exception),
        Title = (e) => "Unknown error",
        Description = (e) => "Something went wrong",
        Status = HttpStatusCode.InternalServerError
    };
    internal void Map<T>(HttpStatusCode status, Func<T, string> title, Func<T, string> description) where T : Exception
    {
        _mappings.TryAdd(typeof(T), new ExceptionMapping<T>
        {
            Type = typeof(T),
            Status = status,
            Title = title,
            Description = description,
        });
    }

    internal ProblemDetails ToProblemDetails(Exception exception)
    {
        if (!_mappings.TryGetValue(exception.GetType(), out var mapping))
        {
            mapping = _defaultMapping;
        }
        return mapping.ToProblemDetails(exception);
    }

    private interface IExceptionMapping
    {
        ProblemDetails ToProblemDetails(Exception exception);
    }

    private class ExceptionMapping<T> : IExceptionMapping where T : Exception
    {
        public Type Type { get; set; } = typeof(Exception);
        public HttpStatusCode Status { get; set; } = HttpStatusCode.InternalServerError;
        public Func<T, string> Title { get; set; }
        public Func<T, string> Description { get; set; }

        public ProblemDetails ToProblemDetails(Exception exception)
        {
            var e = exception as T;
            if (e == null)
            {
                throw new ArgumentException($"Exception should be of type {Type.FullName}", nameof(exception));
            }

            return new ProblemDetails
            {
                Type = Type.FullName,
                Status = (int)Status,
                Title = Title(e),
                Detail = Description(e)
            };
        }
    }
}
