namespace DiaperTracker.Domain.Repositories;

public interface ITaskRecordRepository : IRepositoryBase<TaskRecord>
{
    Task<TaskRecord> Create(TaskRecord task, CancellationToken token = default);

    Task<IQueryable<TaskRecord>> FindWithFilters(string? projectId = null, string? typeId = null, string? userId = null, CancellationToken token = default);

    Task Delete(TaskRecord task, CancellationToken token = default);
}
