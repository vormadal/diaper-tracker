using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class TaskTypeRepository : RepositoryBase<TaskType>, ITaskTypeRepository
{
    public TaskTypeRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TaskType>> GetAll(CancellationToken token = default)
    {
        return await _set.ToListAsync(token);
    }
}
