using DiaperTracker.Contracts.Project;
using DiaperTracker.Services.Abstractions;
using Duende.IdentityServer.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[Authorize]
[ApiController]

[Route("api/projects")]
[Consumes("application/json")]
[Produces("application/json")]
public class ProjectController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <summary>
    /// Gets the projects of the current user
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IEnumerable<ProjectDto>> GetMyProjects(CancellationToken token)
    {
        return await _projectService.GetByUser(User.GetSubjectId(), token);
    }

    /// <summary>
    /// Gets the project with the specified id
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ProjectDto> GetProject([FromRoute()] string id, CancellationToken token)
    {
        return await _projectService.GetByProjectAndUser(id, User.GetSubjectId(), token);
    }

    /// <summary>
    /// Create a project with the given name and the logged in user as the administrator
    /// </summary>
    /// <param name="project">The project to be created</param>
    /// <param name="token">Cancellation token</param>
    /// <returns>The created project</returns>
    [HttpPost]
    public async Task<ProjectDto> CreateProject(
        [FromBody] CreateProjectDto project, 
        CancellationToken token)
    {
        return await _projectService.Create(project, User.GetSubjectId(), token);
    }
}
