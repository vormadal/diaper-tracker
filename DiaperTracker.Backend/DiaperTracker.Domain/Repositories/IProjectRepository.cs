namespace DiaperTracker.Domain.Repositories;

public interface IProjectRepository : IRepositoryBase<Project>
{
    Task<IEnumerable<Project>> FindByUser(string userId, bool includeDeleted = false, CancellationToken token = default);

    Task<Project?> FindById(string id, bool includeDeleted = false, CancellationToken token = default);
}
