using DiaperTracker.Contracts.Project;

namespace DiaperTracker.Services.Abstractions;

public interface IProjectService
{
    Task<ProjectDto> GetByProjectAndUser(string projectId, string userId, CancellationToken token = default);

    Task<IEnumerable<ProjectDto>> GetByUser(string userId, CancellationToken token = default);

    Task<ProjectDto> Create(CreateProjectDto project, string userId, CancellationToken token = default);
}