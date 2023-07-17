namespace DiaperTracker.Domain.Repositories;

public interface ITaskRecordRepository : IRepositoryBase<TaskRecord>
{
    Task<TaskRecord> Create(TaskRecord task, CancellationToken token = default);

    Task<IEnumerable<TaskRecord>> FindByProjectAndType(string? projectId, string? typeId, int? count, CancellationToken token = default);

    Task Delete(TaskRecord task, CancellationToken token = default);
}
