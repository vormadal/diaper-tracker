using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.Task;
using DiaperTracker.Services.Abstractions;
using Duende.IdentityServer.Extensions;
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
        CancellationToken token)
    {
            return await _taskRecordService.GetByProjectAndType(null, id, count, token);
    }
}
