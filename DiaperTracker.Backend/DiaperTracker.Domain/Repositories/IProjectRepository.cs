namespace DiaperTracker.Domain.Repositories;

public interface IProjectRepository : IRepositoryBase<Project>
{
    Task<IEnumerable<Project>> FindByUser(string userId, CancellationToken token = default);

}
