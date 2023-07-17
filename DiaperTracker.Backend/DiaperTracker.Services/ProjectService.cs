using DiaperTracker.Contracts.Project;
using DiaperTracker.Domain;
using DiaperTracker.Domain.Exceptions;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;
using Mapster;

namespace DiaperTracker.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IProjectMemberRepository _projectMemberRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProjectService(IProjectRepository projectRepository, IProjectMemberRepository projectMemberRepository, IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _projectMemberRepository = projectMemberRepository;
        _unitOfWork = unitOfWork;
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

        if(membership == null)
        {
            throw new EntityNotFoundException($"Membership in project {projectId} and user {userId} does not exist");
        }

        var project = await _projectRepository.FindById(projectId, token);
        return project.Adapt<ProjectDto>();
    }

    public async Task<IEnumerable<ProjectDto>> GetByUser(string userId, CancellationToken token = default)
    {
        var projects = await _projectRepository.FindByUser(userId, token);

        return projects.Adapt<IEnumerable<ProjectDto>>();
    }
}