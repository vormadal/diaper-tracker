using DiaperTracker.Contracts.Task;

namespace DiaperTracker.Services.Abstractions;

public interface ITaskRecordService
{
    Task<TaskRecordDto> CreateTask(CreateTaskDto task, string userId, CancellationToken token = default);

    Task<TaskRecordDto> UpdateTask(string id, UpdateTaskDto task, CancellationToken token = default);

    Task DeleteTask(string id, CancellationToken token = default);

    Task<IEnumerable<TaskRecordDto>> GetByProjectAndType(string? project, string? typeId, int? count = null, CancellationToken token = default);
    
    Task<IEnumerable<TaskRecordDto>> GetAll(int? count, CancellationToken token = default);
}
