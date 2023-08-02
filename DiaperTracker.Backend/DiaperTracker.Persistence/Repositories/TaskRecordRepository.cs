using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DiaperTracker.Persistence.Repositories;

internal class TaskRecordRepository : RepositoryBase<TaskRecord>, ITaskRecordRepository
{
    public TaskRecordRepository(DiaperTrackerDatabaseContext context) : base(context)
    {
    }

    public override Task<TaskRecord?> FindById(string id, CancellationToken token = default)
    {
        return _set.Where(x => x.Id == id)
            .Include(x => x.Type)
            .Include(x => x.CreatedBy)
            .FirstOrDefaultAsync(token);
    }

    public async Task<IEnumerable<TaskRecord>> FindByProjectAndType(
        string? projectId, 
        string? typeId, 
        string? userId,
        int? offset, 
        int? count, 
        CancellationToken token = default)
    {
        var q = _set.AsQueryable();
        if(projectId is not null)
        {
            q = q.Where(x => x.ProjectId ==  projectId);
        }

        if(typeId is not null)
        {
            q = q.Where(x => x.TypeId ==  typeId);
        }

        if (userId is not null)
        {
            q = q.Where(x => x.CreatedById == userId);
        }


        var query = q
            .Include(x => x.Type)
            .Include(x => x.CreatedBy)
            .OrderByDescending(x => x.Date);

        if(count == null)
        {
            return await query.ToListAsync(token);
            
        }

        return query.Skip(offset ?? 0).Take(count.Value);
    }
}
