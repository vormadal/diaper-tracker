using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class ProjectMemberRepository : RepositoryBase<ProjectMember>, IProjectMemberRepository
{
    public ProjectMemberRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public async Task<ProjectMember?> GetMemberAsync(string projectId, string userId, CancellationToken token = default)
    {
        return await _set.Where(x => x.UserId == userId && x.ProjectId == projectId)
            .Include(x => x.Project)
            .Include(x => x.User)
            .FirstOrDefaultAsync(token);
    }
}
