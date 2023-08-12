using DiaperTracker.Contracts;
using DiaperTracker.Domain.Repositories;
using DiaperTracker.Services.Abstractions;

namespace DiaperTracker.Services;

public class StatisticsService : IStatisticsService
{

    private readonly ITaskRecordRepository _taskRecordRepository;

    public StatisticsService(
        ITaskRecordRepository taskRecordRepository)
    {
        _taskRecordRepository = taskRecordRepository;
    }

    public async Task<Statistics> GetTaskStats(string projectId, string userId, CancellationToken token = default)
    {
        var tasks = await _taskRecordRepository.FindWithFilters(projectId, token: token);

        var keyLabel = "Date";
        var valueLabel = "Count";

        var grouped = tasks.ToList().Select(x => new
        {
            date = x.Date.Date,
            label = x.Type.DisplayName,
            type = x.Type
        })
            .GroupBy(x =>x.date)
            .OrderBy(x => x.Key);


        var stats = new Statistics
        {
            KeyLabel = keyLabel,
            ValueLabel = valueLabel,
            Legend = tasks.Select(x => x.Type.DisplayName).Distinct().ToList(),
        };


        foreach (var group in grouped)
        {

            var item = new Dictionary<string, object>
            {
                { keyLabel, group.Key.ToString("dd-MM") }
            };

            foreach (var legend in stats.Legend)
            {
                var count = group.Count(x => x.type.DisplayName == legend);
                item.Add(legend, count);
            }
            stats.Data.Add(item);
        }

        return stats;
    }
}