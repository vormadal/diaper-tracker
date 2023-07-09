using DiaperTracker.Contracts.Person;

namespace DiaperTracker.Services.Abstractions;

public interface ITaskTypeService
{
    Task<IEnumerable<TaskTypeDto>> GetAll(CancellationToken token = default);
}