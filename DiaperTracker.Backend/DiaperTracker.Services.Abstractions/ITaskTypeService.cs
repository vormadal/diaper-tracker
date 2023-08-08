using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.TaskType;

namespace DiaperTracker.Services.Abstractions;

public interface ITaskTypeService
{
    Task<TaskTypeDto> Create(CreateTaskType taskType, string userId, CancellationToken token = default);
    
    Task Delete(string id, string userId, CancellationToken token = default);
    
    Task<TaskTypeDto> FindById(string id, string userId, CancellationToken token = default);
    
    Task<TaskTypeDto> Update(string id, UpdateTaskTypeDto taskType, string userId, CancellationToken token = default);

    Task<IEnumerable<TaskTypeDto>> FindByProject(string projectId, string userId, CancellationToken token = default);
}