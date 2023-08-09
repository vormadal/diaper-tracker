using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace DiaperTracker.Presentation.OpenApi;

public class ExceptionMapperOptions
{
    private readonly Dictionary<Type, IExceptionMapping> _mappings = new();
    private readonly ExceptionMapping<Exception> _defaultMapping = new()
    {
        Type = typeof(Exception),
        Title = (e) => "Unknown error",
        Description = (e) => "Something went wrong",
        Status = HttpStatusCode.InternalServerError
    };
    private readonly bool _includeStackTrace;

    public ExceptionMapperOptions(bool includeStackTrace)
    {
        _includeStackTrace = includeStackTrace;
    }

    internal void Map<T>(HttpStatusCode status, Func<T, string> title) where T : Exception
    {
        Map(status, title, x => x.Message);
    }
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
        var problemDetails = mapping.ToProblemDetails(exception);

        if(_includeStackTrace)
        {
            problemDetails.Extensions.Add("StackTrace", exception.StackTrace);
        }

        return problemDetails;
    }

    private interface IExceptionMapping
    {
        ProblemDetails ToProblemDetails(Exception exception);
    }

    private class ExceptionMapping<T> : IExceptionMapping where T : Exception
    {
        public Type Type { get; set; } = typeof(Exception);
        public HttpStatusCode Status { get; set; } = HttpStatusCode.InternalServerError;
        public Func<T, string> Title { get; set; } = x => x.Message;
        public Func<T, string> Description { get; set; } = x => x.Message;

        public ProblemDetails ToProblemDetails(Exception exception)
        {
            var e = exception as T ?? throw new ArgumentException($"Exception should be of type {Type.FullName}", nameof(exception));

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
