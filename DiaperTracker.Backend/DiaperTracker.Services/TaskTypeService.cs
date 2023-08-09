using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.TaskType;
using DiaperTracker.Domain;
using DiaperTracker.Domain.Exceptions;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;
using Mapster;

namespace DiaperTracker.Services;

public class TaskTypeService : ITaskTypeService
{
    private readonly IProjectService _projectService;
    private readonly ITaskTypeRepository _taskTypeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TaskTypeService(
        IProjectService projectService,
        ITaskTypeRepository taskTypeRepository,
        IUnitOfWork unitOfWork)
    {
        _projectService = projectService;
        _taskTypeRepository = taskTypeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskTypeDto> Create(CreateTaskType taskType, string userId, CancellationToken token = default)
    {
        // only used to validate the user access to the specified project
        await _projectService.GetByIdAndUserWithRole(taskType.ProjectId, userId, true, token);

        var toCreate = taskType.Adapt<TaskType>();
        await _taskTypeRepository.Create(toCreate, token);
        await _unitOfWork.SaveChangesAsync(token);

        return toCreate.Adapt<TaskTypeDto>();
    }

    public async Task Delete(string id, string userId, CancellationToken token = default)
    {
        var taskType = await _taskTypeRepository.FindById(id, token);
        EntityNotFoundException.ThrowIfNull(taskType, id);

        // only used to validate the user access to the specified project
        await _projectService.GetByIdAndUserWithRole(taskType.ProjectId, userId, true, token);

        taskType.IsDeleted = true;
        await _taskTypeRepository.Update(taskType, token);
        await _unitOfWork.SaveChangesAsync(token);
    }

    public async Task<TaskTypeDto> FindById(string id, string userId, CancellationToken token = default)
    {
        var existing = await _taskTypeRepository.FindById(id, token);
        EntityNotFoundException.ThrowIfNull(existing, id);

        // only used to validate the user access to the specified project
        await _projectService.GetByIdAndUserWithRole(existing.ProjectId, userId, true, token);

        return existing.Adapt<TaskTypeDto>();
    }

    public async Task<IEnumerable<TaskTypeDto>> FindByProject(string projectId, string userId, CancellationToken token = default)
    {
        var results = await _taskTypeRepository.FindByProject(projectId, token: token);
        await _projectService.GetByIdAndUserWithRole(projectId, userId, false, token);

        return results.Adapt<IEnumerable<TaskTypeDto>>();
    }

    public async Task<TaskTypeDto> Update(string id, UpdateTaskTypeDto taskType, string userId, CancellationToken token = default)
    {
        var existing = await _taskTypeRepository.FindById(id, token);
        EntityNotFoundException.ThrowIfNull(existing, id);

        await _projectService.GetByIdAndUserWithRole(existing.ProjectId, userId, true, token);

        var updated = await _taskTypeRepository.Update(taskType.Adapt(existing), token);
        await _unitOfWork.SaveChangesAsync(token);
        return updated.Adapt<TaskTypeDto>();
    }
}