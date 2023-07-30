using DiaperTracker.Contracts.Task;
using DiaperTracker.Domain;
using DiaperTracker.Domain.Exceptions;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;
using Mapster;

namespace DiaperTracker.Services;

internal class TaskRecordService : ITaskRecordService
{
    private readonly ITaskRecordRepository _taskRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TaskRecordService(ITaskRecordRepository taskRepository, IUnitOfWork unitOfWork, IProjectRepository projectRepository)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
        _projectRepository = projectRepository;
    }

    public async Task<TaskRecordDto> CreateTask(CreateTaskDto task, string userId, CancellationToken token = default)
    {
        var project = await _projectRepository.FindById(task.ProjectId, false, token);
        if (project == null || !project.TaskTypes.Any(x => x.Id == task.TypeId))
        {
            throw new Exception("Project or task type is incorrect");
        }

        var record = task.Adapt<TaskRecord>();
        record.Date = DateTime.UtcNow;
        record.CreatedById = userId;
        var created = await _taskRepository.Create(record, token);
        await _unitOfWork.SaveChangesAsync(token);
        return created.Adapt<TaskRecordDto>();
    }

    public async Task DeleteTask(string id, CancellationToken token = default)
    {
        var record = await _taskRepository.FindById(id, token);
        if (record is null)
        {
            throw new EntityNotFoundException(typeof(TaskRecord), id);
        }
        await _taskRepository.Delete(record);
        await _unitOfWork.SaveChangesAsync(token);
    }

    public async Task<IEnumerable<TaskRecordDto>> GetAll(int? count, CancellationToken token = default)
    {
        var query = _taskRepository.FindAll(token);
        if (count is not null)
        {
            return query.Take(count.Value).ToList().Adapt<IEnumerable<TaskRecordDto>>();
        }

        return query.ToList().Adapt<IEnumerable<TaskRecordDto>>();
    }

    public async Task<IEnumerable<TaskRecordDto>> GetByProjectAndType(string? projectId, string? typeId, int? count = null, CancellationToken token = default)
    {
        var results = await _taskRepository.FindByProjectAndType(projectId, typeId, count, token);
        return results.Adapt<IEnumerable<TaskRecordDto>>();
    }

    public async Task<TaskRecordDto> UpdateTask(string id, UpdateTaskDto task, CancellationToken token = default)
    {
        var record = await _taskRepository.FindById(id, token);
        var update = task.Adapt(record);
        await _taskRepository.Update(update, token);
        await _unitOfWork.SaveChangesAsync();

        return update.Adapt<TaskRecordDto>();
    }
}
