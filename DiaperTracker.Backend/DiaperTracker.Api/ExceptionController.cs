using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)]
public class ExceptionController : ControllerBase
{
    private readonly ExceptionMapperOptions _mapper;

    public ExceptionController(ExceptionMapperOptions mapper)
    {
        _mapper = mapper;
    }
    [Route("/error-development")]
    public IActionResult HandleErrorDevelopment([FromServices] IHostEnvironment hostEnvironment)
    {
        if (!hostEnvironment.IsDevelopment())
        {
            return NotFound();
        }

        var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>()!;

        var problem = _mapper.ToProblemDetails(exceptionHandlerFeature.Error);
        
        return new JsonResult(problem);
    }

    [Route("/error")]
    public IActionResult HandleError() => Problem();

}
