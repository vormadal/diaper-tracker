using DiaperTracker.Contracts;
using DiaperTracker.Services.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[Authorize]
[ApiController]
[Route("api/statistics")]
[Consumes("application/json")]
[Produces("application/json")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(IStatisticsService projectService)
    {
        _statisticsService = projectService;
    }

    /// <summary>
    /// Gets the statistics of the current user
    /// </summary>
    /// <param name="projectId"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("tasks")]
    public async Task<Statistics> GetTaskStatistics(
        [FromQuery] string projectId,
        CancellationToken token)
    {
        return await _statisticsService.GetTaskStats(projectId, User.GetSubjectId(), token);
    }


}
