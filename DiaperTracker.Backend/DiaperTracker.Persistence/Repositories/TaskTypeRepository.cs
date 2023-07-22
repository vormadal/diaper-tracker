using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class TaskTypeRepository : RepositoryBase<TaskType>, ITaskTypeRepository
{
    public TaskTypeRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TaskType>> FindByProject(string projectId, bool includeDeleted = false, CancellationToken token = default)
    {
        var q = _set.Where(x => x.ProjectId == projectId);

        if (!includeDeleted)
        {
            q = q.Where(x => x.IsDeleted == false);
        }

        return await q.ToListAsync(token);
    }

}
