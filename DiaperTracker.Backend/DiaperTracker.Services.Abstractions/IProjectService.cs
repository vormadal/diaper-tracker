using DiaperTracker.Contracts.Project;
using DiaperTracker.Contracts.ProjectMember;

namespace DiaperTracker.Services.Abstractions;

public interface IProjectService
{
    Task<ProjectDto> GetByProjectAndUser(string projectId, string userId, CancellationToken token = default);

    Task<IEnumerable<ProjectDto>> GetByUser(string userId, CancellationToken token = default);

    Task<ProjectDto> Create(CreateProjectDto project, string userId, CancellationToken token = default);

    Task Delete(string projectId, CancellationToken token = default);
    
    Task<ProjectMemberInviteDto> InviteMember(string projectId, CreateProjectMemberInviteDto invite, string userId, CancellationToken token = default);

    Task<ProjectMemberInviteDto> RespondToInvite(ProjectMemberInviteResponse response, string? userId, CancellationToken token = default);
    
    Task<IEnumerable<ProjectMemberDto>> GetMembers(string id, string userId, CancellationToken token = default);
    Task<ProjectMemberInviteDto> GetInvite(string id, CancellationToken token = default);
}