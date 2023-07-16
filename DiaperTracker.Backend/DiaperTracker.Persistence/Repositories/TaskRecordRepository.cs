using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class TaskRecordRepository : RepositoryBase<TaskRecord>, ITaskRecordRepository
{
    public TaskRecordRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TaskRecord>> FindByType(string typeId, int? count, CancellationToken token = default)
    {
        var query = _set.Where(x => x.TypeId == typeId)
            .Include(x => x.Type)
            .Include(x => x.CreatedBy)
            .OrderByDescending(x => x.Date);

        if(count == null)
        {
            return await query.ToListAsync(token);
            
        }

        return query.Take(count.Value);
    }

}
