﻿namespace DiaperTracker.Domain.Repositories;

public interface ITaskTypeRepository
{
    Task<TaskType> Create(TaskType taskType, CancellationToken token = default);

    Task<TaskType> Update(TaskType taskType, CancellationToken token = default);

    Task<IEnumerable<TaskType>> GetAll(CancellationToken token = default);
}