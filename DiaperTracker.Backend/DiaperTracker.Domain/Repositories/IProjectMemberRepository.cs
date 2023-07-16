namespace DiaperTracker.Domain.Repositories;

public interface IProjectMemberRepository : IRepositoryBase<ProjectMember>
{
    Task<ProjectMember?> GetMemberAsync(string projectId, string userId, CancellationToken token = default);
}
