using DiaperTracker.Contracts.Person;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;
using Mapster;

namespace DiaperTracker.Services;

public class TaskTypeService : ITaskTypeService
{
    private readonly ITaskTypeRepository _taskTypeRepository;
    
    public TaskTypeService(ITaskTypeRepository taskTypeRepository)
    {
        _taskTypeRepository = taskTypeRepository;
    }

    public async Task<IEnumerable<TaskTypeDto>> GetAll(CancellationToken token = default)
    {
        var types = await _taskTypeRepository.GetAll(token);

        return types.Adapt<IEnumerable<TaskTypeDto>>();
    }

}