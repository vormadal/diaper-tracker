using DiaperTracker.Domain.Repositories;

namespace DiaperTracker.Persistence.Repositories;

internal class UnitOfWork : IUnitOfWork
{
    private readonly DiaperTrackerDatabaseContext _context;

    public UnitOfWork(DiaperTrackerDatabaseContext context)
    {
        _context = context;
    }
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
