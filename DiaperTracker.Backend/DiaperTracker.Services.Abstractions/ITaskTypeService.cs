using DiaperTracker.Contracts.Person;

namespace DiaperTracker.Services.Abstractions;

public interface ITaskTypeService
{
    Task<TaskTypeDto> Create(CreateTaskType taskType, string userId, CancellationToken token);
    Task<IEnumerable<TaskTypeDto>> GetAll(CancellationToken token = default);
}