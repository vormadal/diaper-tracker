using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.Project;
using DiaperTracker.Contracts.ProjectMember;
using DiaperTracker.Services.Abstractions;
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
    private readonly ITaskTypeService _taskTypeService;

    public ProjectController(IProjectService projectService, ITaskTypeService taskTypeService)
    {
        _projectService = projectService;
        _taskTypeService = taskTypeService;
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

    /// <summary>
    /// Gets the project with the specified id
    /// </summary>
    /// <param name="id"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ProjectDto> GetProject([FromRoute] string id, CancellationToken token)
    {
        return await _projectService.GetByProjectAndUser(id, User.GetSubjectId(), token);
    }

    /// <summary>
    /// Deletes the project with the given id
    /// </summary>
    /// <param name="id">Id of the project</param>
    /// <param name="token"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    public async Task DeleteProject([FromRoute] string id, CancellationToken token)
    {
        await _projectService.Delete(id, token);
    }

    [HttpPut("{id}")]
    public async Task<ProjectDto> UpdateProject([FromRoute] string id, [FromBody] UpdateProjectDto update, CancellationToken token)
    {
        return await _projectService.Update(id, update, User.GetSubjectId(), token);
    }

    [HttpGet("{id}/task-types")]
    public async Task<IEnumerable<TaskTypeDto>> GetProjectTaskTypes([FromRoute] string id, CancellationToken token)
    {
        return await _taskTypeService.FindByProject(id, User.GetSubjectId(), token);
    }

    [HttpGet("{id}/members")]
    public async Task<IEnumerable<ProjectMemberDto>> GetMembers([FromRoute] string id, CancellationToken token)
    {
        return await _projectService.GetMembers(id, User.GetSubjectId(), token);
    }

    [HttpPost("{id}/invite-member")]
    public async Task<ProjectMemberInviteDto> InviteProjectMember(
        [FromRoute] string id,
        [FromBody] CreateProjectMemberInviteDto invite, 
        CancellationToken token)
    {
        return await _projectService.InviteMember(id, invite, User.GetSubjectId(), token);
    }

}
