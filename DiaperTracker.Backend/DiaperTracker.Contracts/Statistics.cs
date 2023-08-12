using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts;

public class Statistics
{
    /// <summary>
    /// Label for the value - usually this is the Y-axis label.
    /// </summary>
    [Required]
    public string ValueLabel { get; set; }

    /// <summary>
    /// Label for each key - usually this is the X-axis label.
    /// </summary>
    [Required]
    public string KeyLabel { get; set; }

    /// <summary>
    /// Each value corresponds to a value in the data list. In practise each value here corresponds to a line in the graph
    /// </summary>
    [Required]
    public IList<string> Legend { get; set; } = new List<string>();

    /// <summary>
    /// List of maps containing a property for each <see cref="Legend"/> and the <see cref="KeyLabel"/>
    /// </summary>
    [Required]
    public IList<Dictionary<string, object>> Data { get; set; } = new List<Dictionary<string, object>>();
}
