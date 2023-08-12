using DiaperTracker.Contracts;

namespace DiaperTracker.Services.Abstractions;

public interface IStatisticsService
{
    Task<Statistics> GetTaskStats(string projectId, string userId, CancellationToken token = default);
}