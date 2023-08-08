namespace DiaperTracker.Contracts;

public class PageInfo
{
    /// <summary>
    /// Specificy the offset of which you want to retrieve items
    /// </summary>
    public int? Offset { get; set; } = 0;

    /// <summary>
    /// Specify how many elements to retrieve
    /// </summary>
    public int? Count { get; set; } = null;
}
