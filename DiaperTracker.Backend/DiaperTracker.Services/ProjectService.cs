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

public class InviteOptions
{
    public string InvitationUrl { get; set; }
}
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
        await _unitOfWork.SaveChangesAsync();

        return toCreate.Adapt<ProjectDto>();
    }

    public async Task<ProjectDto> GetByProjectAndUser(string projectId, string userId, CancellationToken token = default)
    {
        var membership = await _projectMemberRepository.GetMemberAsync(projectId, userId, token);

        if (membership == null)
        {
            throw new EntityNotFoundException($"Membership in project {projectId} and user {userId} does not exist");
        }

        var project = await _projectRepository.FindById(projectId, token: token);
        var taskTypes = await _taskTypeRepository.FindByProject(projectId, token: token);

        if (project == null)
        {
            throw new EntityNotFoundException(typeof(Project), projectId);
        }

        var dto = project.Adapt<ProjectDto>();
        dto.TaskTypes = taskTypes.Adapt<IEnumerable<TaskTypeDto>>();
        return dto;
    }

    public async Task<IEnumerable<ProjectDto>> GetByUser(string userId, CancellationToken token = default)
    {
        var projects = await _projectRepository.FindByUser(userId, token: token);

        return projects.Adapt<IEnumerable<ProjectDto>>();
    }

    public async Task Delete(string projectId, CancellationToken token = default)
    {
        var project = await _projectRepository.FindById(projectId, token: token);

        project.IsDeleted = true;

        await _projectRepository.Update(project, token);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<ProjectMemberInviteDto> InviteMember(string projectId, CreateProjectMemberInviteDto invite, string userId, CancellationToken token = default)
    {
        var project = await _projectRepository.FindById(projectId, token: token);

        if (!project.Members.Any(x => x.UserId == userId && x.IsAdmin))
        {
            throw new Exception("User is not allowed to invite members");
        }

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
        await _unitOfWork.SaveChangesAsync();

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
            throw new Exception("Cannot accept without a user");
        }

        var invite = await _projectMemberInviteRepository.FindById(response.Id, token);

        if (invite.Status != InviteStatus.Pending)
        {
            throw new Exception("This invite has already been used");
        }

        if (response.Response == InviteResponse.Accepted)
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
        await _unitOfWork.SaveChangesAsync();

        return invite.Adapt<ProjectMemberInviteDto>();
    }

    public async Task<IEnumerable<ProjectMemberDto>> GetMembers(string id, string userId, CancellationToken token = default)
    {
        var project = await _projectRepository.FindById(id, token: token);
        if (!project.Members.Any(x => x.UserId == userId))
        {
            throw new Exception("You don't have access");
        }

        return project.Members.Adapt<IEnumerable<ProjectMemberDto>>();
    }

    public async Task<ProjectMemberInviteDto> GetInvite(string id, CancellationToken token = default)
    {
        var invite = await _projectMemberInviteRepository.FindById(id, token);

        return invite.Adapt<ProjectMemberInviteDto>();
    }

    public async Task<ProjectDto> Update(string id, UpdateProjectDto update, string userId, CancellationToken token = default)
    {
        var project = await _projectRepository.FindById(id, false, token);

        if(!project.Members.Any(x => x.UserId == userId && x.IsAdmin))
        {
            throw new Exception("You don't have access to this");
        }

        await _projectRepository.Update(update.Adapt(project), token);
        await _unitOfWork.SaveChangesAsync(token);

        return project.Adapt<ProjectDto>();
    }
}