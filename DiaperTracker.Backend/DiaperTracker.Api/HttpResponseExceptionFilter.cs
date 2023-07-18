using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using DiaperTracker.Domain.Exceptions;
using DiaperTracker.Presentation.OpenApi;

namespace DiaperTracker.Api;

public class HttpResponseExceptionFilter : IActionFilter, IOrderedFilter
{
    private readonly ExceptionMapperOptions _mapper;

    public HttpResponseExceptionFilter(ExceptionMapperOptions mapper)
    {
        _mapper = mapper;
    }
    public int Order => int.MaxValue - 10;

    public void OnActionExecuting(ActionExecutingContext context) { }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if(context.Exception is null)
        {
            return;
        }

        var exception = _mapper.ToProblemDetails(context.Exception);
        if (exception is not null)
        {
            context.Result = new ObjectResult(exception)
            {
                StatusCode = exception.Status
            };

            context.ExceptionHandled = true;
        }
    }
}
