using DiaperTracker.Contracts.Task;
using DiaperTracker.Services.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[ApiController]
[Authorize]
[Route("api/tasks")]
[Consumes("application/json")]
[Produces("application/json")]
public class TaskController : ControllerBase
{
    private readonly ITaskRecordService _taskService;

    public TaskController(ITaskRecordService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IEnumerable<TaskRecordDto>> GetTasks(
        [FromQuery] string? project,
        [FromQuery] string? type,
        [FromQuery] int? offset,
        [FromQuery] int? count,
        [FromQuery] string? userId,
        CancellationToken token)
    {
        return await _taskService.GetByProjectAndType(project, type, userId, offset, count, token);
    }

    [HttpGet("{id}")]
    public async Task<TaskRecordDto> GetTask(
        [FromRoute] string id,
        CancellationToken token)
    {
        return await _taskService.FindTask(id, token);
    }

    /// <summary>
    /// Create a task with the current date and time with the logged in user as the owner
    /// </summary>
    /// <param name="task">The task to be created</param>
    /// <param name="token">Cancellation token</param>
    /// <returns>The created task with owner and date</returns>
    /// <response code="200" cref="TaskRecordDto">Success for everyone</response>
    /// <link
    [HttpPost]
    public async Task<TaskRecordDto> CreateTask(
        [FromBody] CreateTaskDto task, 
        CancellationToken token)
    {
        return await _taskService.CreateTask(task, User.GetSubjectId(), token);
    }

    [HttpPut("{id}")]
    public async Task<TaskRecordDto> UpdateTask(
        [FromRoute] string id,
        [FromBody] UpdateTaskDto task,
        CancellationToken token)
    {
        return await _taskService.UpdateTask(id, task, token);
    }

    [HttpDelete("{id}")]
    public async Task DeleteTask([FromRoute] string id, CancellationToken token)
    {
        await _taskService.DeleteTask(id, token);
    }
}
