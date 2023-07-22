using DiaperTracker.Contracts.ProjectMember;
using DiaperTracker.Services.Abstractions;
using Duende.IdentityServer.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[ApiController]
[Route("api/invites")]
[Consumes("application/json")]
[Produces("application/json")]
public class MemberInviteController : ControllerBase
{
    private readonly IProjectService _projectService;

    public MemberInviteController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet("{id}")]
    public async Task<ProjectMemberInviteDto> GetInvite(
        [FromRoute] string id,
        CancellationToken token)
    {
        return await _projectService.GetInvite(id, token);
    }

    [Authorize]
    [HttpPost("{id}/accept")]
    public async Task<ProjectMemberInviteDto> AcceptInvite(
        [FromRoute] string id,
        CancellationToken token)
    {
        var response = new ProjectMemberInviteResponse
        {
            Id = id,
            Response = InviteResponse.Accepted
        };
        return await _projectService.RespondToInvite(response, User.GetSubjectId(), token);
    }

    [HttpPost("{id}/decline")]
    public async Task<ProjectMemberInviteDto> DeclineInvite(
     [FromRoute] string id,
     CancellationToken token)
    {
        var response = new ProjectMemberInviteResponse
        {
            Id = id,
            Response = InviteResponse.Declined
        };
        return await _projectService.RespondToInvite(response, null, token);
    }
}
