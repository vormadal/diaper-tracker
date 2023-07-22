using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class ProjectRepository : RepositoryBase<Project>, IProjectRepository
{
    public ProjectRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public async Task<Project?> FindById(string id, bool includeDeleted = false, CancellationToken token = default)
    {
        var q = _set
            .Include(x => x.TaskTypes)
            .Include(x => x.Members)
                .ThenInclude(x => x.User)
            .Where(x => x.Id == id);

        if (!includeDeleted)
        {
            q = q.Where(x => x.IsDeleted == false);
        }

        return await q.FirstAsync(token);
    }

    public async Task<IEnumerable<Project>> FindByUser(string userId, bool includeDeleted = false, CancellationToken token = default)
    {
        var memberships = await _context.Members.Where(x => x.UserId == userId)
            .Include(x => x.Project)
            .ToListAsync(token);

        var q = memberships.Select(x => x.Project);
        if (!includeDeleted)
        {
            q = q.Where(x => x.IsDeleted == false);
        }

        return q.ToList();
    }
}
