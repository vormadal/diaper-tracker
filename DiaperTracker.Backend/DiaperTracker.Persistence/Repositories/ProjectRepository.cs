using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class ProjectRepository : RepositoryBase<Project>, IProjectRepository
{
    public ProjectRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Project>> FindByUser(string userId, CancellationToken token = default)
    {
        var memberships = await _context.Members.Where(x => x.UserId == userId)
            .Include(x => x.Project)
            .ToListAsync(token);

        return memberships.Select(x => x.Project).ToList();
    }
}
