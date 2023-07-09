using DiaperTracker.Contracts.Person;
using DiaperTracker.Contracts.Task;
using DiaperTracker.Services.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiaperTracker.Presentation.OpenApi.Controllers;

[ApiController]
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

    [HttpGet]
    public async Task<IEnumerable<TaskTypeDto>> GetAllTypes(CancellationToken token)
    {
        return await _taskTypeService.GetAll(token);
    }

    [HttpGet("{id}/tasks")]
    public async Task<IEnumerable<TaskRecordDto>> GetTasksOfType(
        [FromRoute] string id,
        [FromQuery] int? count,
        CancellationToken token)
    {
        return await _taskRecordService.GetByType(id, count, token);
    }
}
