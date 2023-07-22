using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class ProjectMemberInviteRepository : RepositoryBase<ProjectMemberInvite>, IProjectMemberInviteRepository
{
    public ProjectMemberInviteRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public override async Task<ProjectMemberInvite?> FindById(string id, CancellationToken token = default)
    {
        var invite = await _set.Where(x => x.Id == id)
            .Include(x => x.Project)
            .ThenInclude(x => x.Members)
            .Include(x => x.CreatedBy)
            .Include(x => x.AcceptedBy)
            .FirstAsync(token);

        return invite;
    }
}
