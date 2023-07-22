using DiaperTracker.Contracts.Person;

namespace DiaperTracker.Services.Abstractions;

public interface ITaskTypeService
{
    Task<TaskTypeDto> Create(CreateTaskType taskType, string userId, CancellationToken token = default);
    Task Delete(string id, string userId, CancellationToken token = default);
}