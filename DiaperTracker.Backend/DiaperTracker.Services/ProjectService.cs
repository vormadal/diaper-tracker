using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.Project;
using DiaperTracker.Contracts.ProjectMember;
using DiaperTracker.Domain;
using DiaperTracker.Domain.Exceptions;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;
using Mapster;
using Microsoft.Extensions.Options;

namespace DiaperTracker.Services;

public class ProjectService : IProjectService
{
    private readonly IOptions<InviteOptions> _options;
    private readonly IProjectRepository _projectRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly ITaskTypeRepository _taskTypeRepository;
    private readonly IEmailService _emailService;
    private readonly IProjectMemberInviteRepository _projectMemberInviteRepository;
    private readonly IUnitOfWork _unitOfWork;


    public ProjectService(
        IOptions<InviteOptions> options,
        IProjectRepository projectRepository,
        IProjectMemberRepository projectMemberRepository,
        ITaskTypeRepository taskTypeRepository,
        IEmailService emailService,
        IUnitOfWork unitOfWork,
        IProjectMemberInviteRepository projectMemberInviteRepository)
    {
        _options = options;
        _projectRepository = projectRepository;
        _projectMemberRepository = projectMemberRepository;
        _taskTypeRepository = taskTypeRepository;
        _emailService = emailService;
        _unitOfWork = unitOfWork;
        _projectMemberInviteRepository = projectMemberInviteRepository;
    }

    public async Task<ProjectDto> Create(CreateProjectDto project, string userId, CancellationToken token = default)
    {
        var toCreate = project.Adapt<Project>();
        var admin = new ProjectMember
        {
            IsAdmin = true,
            UserId = userId,
            Project = toCreate
        };

        await _projectMemberRepository.Create(admin, token);
        await _projectRepository.Create(toCreate, token);
        await _unitOfWork.SaveChangesAsync(token);

        return toCreate.Adapt<ProjectDto>();
    }

    public async Task<ProjectDto> GetByIdAndUserWithRole(string projectId, string userId, bool requireAdmin = false, CancellationToken token = default)
    {
        var project = await IsUserAllowed(projectId, userId, requireAdmin, token);
        EntityNotFoundException.ThrowIfNull(project, projectId);

        var taskTypes = await _taskTypeRepository.FindByProject(projectId, token: token);

        var dto = project.Adapt<ProjectDto>();
        dto.TaskTypes = taskTypes.Adapt<IEnumerable<TaskTypeDto>>();
        return dto;
    }

    public async Task<IEnumerable<ProjectDto>> GetByUser(string userId, CancellationToken token = default)
    {
        var projects = await _projectRepository.FindByUser(userId, token: token);

        return projects.Adapt<IEnumerable<ProjectDto>>();
    }

    public async Task Delete(string projectId, string userId, CancellationToken token = default)
    {
        var project = await IsUserAllowed(projectId, userId, true, token);

        project.IsDeleted = true;

        await _projectRepository.Update(project, token);
        await _unitOfWork.SaveChangesAsync(token);
    }

    public async Task<ProjectMemberInviteDto> InviteMember(string projectId, CreateProjectMemberInviteDto invite, string userId, CancellationToken token = default)
    {
        var project = await IsUserAllowed(projectId, userId, true, token);

        var created = await _projectMemberInviteRepository.Create(
            new ProjectMemberInvite
            {
                Email = invite.Email,
                ProjectId = projectId,
                CreatedById = userId,
                CreatedOn = DateTime.UtcNow,
                Status = InviteStatus.Pending
            },
            token);
        await _unitOfWork.SaveChangesAsync(token);

        await _emailService.SendEmail(invite.Email, "Invitation for DiaperTracker",
            @$"
<h1>You have been invited to {project.Name} on DiaperTracker</h1>
<p>Click on this <a href=""{_options.Value.InvitationUrl}{created.Id}"">link</a> to respond to the invite</p>
<br/>
<p>Best regards,</p>
<p>The Diaper Team</p>
");

        return created.Adapt<ProjectMemberInviteDto>();
    }

    public async Task<ProjectMemberInviteDto> RespondToInvite(ProjectMemberInviteResponse response, string? userId, CancellationToken token)
    {
        if (response.Response == InviteResponse.Accepted && userId == null)
        {
            throw new NotAllowedException(
                "Cannot accept a membership invite without being logged in",
                ("userId", userId),
                ("inviteId", response.Id)
                );
        }

        var invite = await _projectMemberInviteRepository.FindById(response.Id, token);

        EntityNotFoundException.ThrowIfNull(invite, response.Id);

        if (invite.Status != InviteStatus.Pending)
        {
            throw new InviteAlreadyAcceptedException(response.Id);
        }

        if (response.Response == InviteResponse.Accepted && userId is not null)
        {
            invite.AcceptedOn = DateTime.UtcNow;
            invite.AcceptedById = userId;
            invite.Status = InviteStatus.Accepted;


            var membership = new ProjectMember
            {
                ProjectId = invite.ProjectId,
                UserId = userId
            };

            // doesn't make sense to invite the user twice
            if (!invite.Project.Members.Any(x => x.UserId == userId))
            {
                await _projectMemberRepository.Create(membership, token);
            }
        }
        else
        {
            invite.DeclinedOn = DateTime.UtcNow;
            invite.Status = InviteStatus.Declined;
        }

        await _projectMemberInviteRepository.Update(invite, token);
        await _unitOfWork.SaveChangesAsync(token);

        return invite.Adapt<ProjectMemberInviteDto>();
    }

    public async Task<IEnumerable<ProjectMemberDto>> GetMembers(string id, string userId, CancellationToken token = default)
    {
        var project = await IsUserAllowed(id, userId, false, token);

        return project.Members.Adapt<IEnumerable<ProjectMemberDto>>();
    }

    public async Task<ProjectMemberInviteDto> GetInvite(string id, CancellationToken token = default)
    {
        var invite = await _projectMemberInviteRepository.FindById(id, token);

        EntityNotFoundException.ThrowIfNull(invite, id);

        return invite.Adapt<ProjectMemberInviteDto>();
    }

    public async Task<ProjectDto> Update(string id, UpdateProjectDto update, string userId, CancellationToken token = default)
    {
        var project = await IsUserAllowed(id, userId, true, token);
        await _projectRepository.Update(update.Adapt(project), token);
        await _unitOfWork.SaveChangesAsync(token);

        var updated = await GetByIdAndUserWithRole(id, userId, false, token);
        return updated.Adapt<ProjectDto>();
    }

    private async Task<Project> IsUserAllowed(string projectId, string userId, bool requireAdmin = false, CancellationToken token = default)
    {
        var project = await _projectRepository.FindById(projectId, false, token);

        EntityNotFoundException.ThrowIfNull(project, projectId);

        if (!project.Members.Any(x => x.UserId == userId && (!requireAdmin || x.IsAdmin)))
        {
            throw new NotAllowedException(
                requireAdmin ? "You are not admin of this project" : "You are not a member of this project",
                ("requireAdmin", requireAdmin),
                ("projectId", projectId),
                ("userId", userId)
                );
        }

        return project;
    }
}