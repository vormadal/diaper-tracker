using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts;

public class PagedList<T>
{
    [Required]
    public IEnumerable<T> Items { get; set; }

    [Required]
    public long Page { get; set; }

    [Required]
    public long Count { get; set; }

    [Required]
    public long Total { get; set; }
}
