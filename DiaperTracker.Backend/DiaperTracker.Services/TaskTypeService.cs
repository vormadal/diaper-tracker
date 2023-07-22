using DiaperTracker.Contracts.Person;
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
        var project =await _projectRepository.FindById(taskType.ProjectId, token);
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
}