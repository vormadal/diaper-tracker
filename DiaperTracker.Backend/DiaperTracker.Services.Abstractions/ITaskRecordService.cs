using DiaperTracker.Contracts;
using DiaperTracker.Contracts.Task;

namespace DiaperTracker.Services.Abstractions;

public interface ITaskRecordService
{
    Task<TaskRecordDto> CreateTask(CreateTaskDto task, string userId, CancellationToken token = default);

    Task<TaskRecordDto> UpdateTask(string id, UpdateTaskDto task, CancellationToken token = default);

    Task DeleteTask(string id, CancellationToken token = default);

    Task<PagedList<TaskRecordDto>> GetPageWithFilters(TaskFilters? filters = null, PageInfo? pageInfo = null, CancellationToken token = default);
    
    Task<TaskRecordDto> FindTask(string id, CancellationToken token = default);
}
