using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.TaskType;
using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;
using Mapster;

namespace DiaperTracker.Services;

public class TaskTypeService : ITaskTypeService
{
    private readonly ITaskTypeRepository _taskTypeRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TaskTypeService(ITaskTypeRepository taskTypeRepository, IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        _taskTypeRepository = taskTypeRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskTypeDto> Create(CreateTaskType taskType, string userId, CancellationToken token)
    {
        var project =await _projectRepository.FindById(taskType.ProjectId, false, token);
        if(project == null || !project.Members.Any(x => x.UserId == userId && x.IsAdmin))
        {
            //TODO make better
            throw new Exception("not allowed to create task types here");
        }

        var toCreate = taskType.Adapt<TaskType>();
        await _taskTypeRepository.Create(toCreate, token);
        await _unitOfWork.SaveChangesAsync();

        return toCreate.Adapt<TaskTypeDto>();
    }

    public async Task Delete(string id, string userId, CancellationToken token = default)
    {
        var taskType = await _taskTypeRepository.FindById(id, token);
        var project = await _projectRepository.FindById(taskType.ProjectId, false, token);

        if(!project.Members.Any(x => x.UserId == userId && x.IsAdmin))
        {
            throw new Exception("You are not allowed");
        }

        taskType.IsDeleted = true;
        await _taskTypeRepository.Update(taskType, token);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<TaskTypeDto> FindById(string id, string userId, CancellationToken token = default)
    {
        var existing = await _taskTypeRepository.FindById(id, token);
        var project = await _projectRepository.FindById(existing.ProjectId, false, token);

        if (!project.Members.Any(x => x.UserId == userId && x.IsAdmin))
        {
            throw new Exception("You are not allowed");
        }

        return existing.Adapt<TaskTypeDto>();
    }

    public async Task<TaskTypeDto> Update(string id, UpdateTaskTypeDto taskType, string userId, CancellationToken token = default)
    {
        var existing = await _taskTypeRepository.FindById(id, token);
        var project = await _projectRepository.FindById(existing.ProjectId, false, token);

        if (!project.Members.Any(x => x.UserId == userId && x.IsAdmin))
        {
            throw new Exception("You are not allowed");
        }


        var updated = await _taskTypeRepository.Update(taskType.Adapt(existing), token);
        await _unitOfWork.SaveChangesAsync();
        return updated.Adapt<TaskTypeDto>();
    }
}