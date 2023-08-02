using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.Task;
using DiaperTracker.Contracts.TaskType;
using DiaperTracker.Services.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[ApiController]
[Authorize]
[Route("api/task-types")]
[Produces("application/json")]
[Consumes("application/json")]
public class TaskTypeController : ControllerBase
{
    private readonly ITaskTypeService _taskTypeService;
    private readonly ITaskRecordService _taskRecordService;
    public TaskTypeController(
        ITaskTypeService taskTypeService,
        ITaskRecordService taskRecordService)
    {
        _taskTypeService = taskTypeService;
        _taskRecordService = taskRecordService;
    }

    [HttpPost]
    public async Task<TaskTypeDto> CreateTaskType([FromBody] CreateTaskType taskType, CancellationToken token)
    {
        return await _taskTypeService.Create(taskType, User.GetSubjectId(), token);
    }

    [HttpGet("{id}/tasks")]
    public async Task<IEnumerable<TaskRecordDto>> GetTasksOfType(
        [FromRoute] string id,
        [FromQuery] int? count,
        [FromQuery] int? offset,
        [FromQuery] string? userId,
        CancellationToken token)
    {
            return await _taskRecordService.GetByProjectAndType(null, id, userId, offset, count, token);
    }

    [HttpGet("{id}")]
    public async Task<TaskTypeDto> GetTaskType([FromRoute] string id, CancellationToken token)
    {
        return await _taskTypeService.FindById(id, User.GetSubjectId(), token);
    }

    [HttpPut("{id}")]
    public async Task<TaskTypeDto> UpdateTaskType(
        [FromRoute] string id,
        [FromBody] UpdateTaskTypeDto taskType,
        CancellationToken token)
    {
        return await _taskTypeService.Update(id, taskType, User.GetSubjectId(), token);
    }

    [HttpDelete("{id}")]
    public async Task DeleteTaskType(
        [FromRoute] string id,
        CancellationToken token)
    {
        await _taskTypeService.Delete(id, User.GetSubjectId(), token);
    }
}
