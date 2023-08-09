using DiaperTracker.Contracts;
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
            throw new InvalidTaskRecordException(
                $"The task type does not exist on the given project",
                ("userId", userId),
                ("typeId", task.TypeId),
                ("projectId", task.ProjectId)
                );
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
        EntityNotFoundException.ThrowIfNull(record, id);
        await _taskRepository.Delete(record, token);
        await _unitOfWork.SaveChangesAsync(token);
    }

    public async Task<TaskRecordDto> FindTask(string id, CancellationToken token = default)
    {
        var record = await _taskRepository.FindById(id, token);
        EntityNotFoundException.ThrowIfNull(record, id);

        return record.Adapt<TaskRecordDto>();
    }

    public Task<IEnumerable<TaskRecordDto>> GetAll(int? count, CancellationToken token = default)
    {
        var query = _taskRepository.FindAll(token);
        if (count is not null)
        {
            query = query.Take(count.Value);
        }

        return Task.FromResult(query.ToList().Adapt<IEnumerable<TaskRecordDto>>());
    }


    public async Task<PagedList<TaskRecordDto>> GetPageWithFilters(TaskFilters? filters = null, PageInfo? pageInfo = null, CancellationToken token = default)
    {
        var query = await _taskRepository.FindWithFilters(filters?.ProjectId, filters?.TypeId, filters?.UserId, token);
        if (filters?.FromDate is not null)
        {
            query = query.Where(x => x.Date >= filters.FromDate);
        }
        if (filters?.ToDate is not null)
        {
            query = query.Where(x => x.Date <= filters.ToDate);
        }

        var count = pageInfo?.Count ?? 100;
        var offset = pageInfo?.Offset ?? 0;
        var total = query.Count();
        query = query.Skip(offset).Take(count);

        var results = query.ToList();

        return new PagedList<TaskRecordDto>
        {
            Count = count,
            Page = count == 0 ? 0 : offset / count,
            Total = total,
            Items = results.Adapt<IEnumerable<TaskRecordDto>>()
        };
    }

    public async Task<TaskRecordDto> UpdateTask(string id, UpdateTaskDto task, CancellationToken token = default)
    {
        var record = await _taskRepository.FindById(id, token);
        EntityNotFoundException.ThrowIfNull(record, id);

        var update = task.Adapt(record);
        await _taskRepository.Update(update, token);
        await _unitOfWork.SaveChangesAsync(token);

        return update.Adapt<TaskRecordDto>();
    }
}
