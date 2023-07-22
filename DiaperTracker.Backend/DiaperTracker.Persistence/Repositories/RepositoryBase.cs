using DiaperTracker.Domain;
using DiaperTracker.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace DiaperTracker.Persistence.Repositories;

internal abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    protected DbSet<T> _set => _context.Set<T>();
    protected readonly DiaperTrackerDatabaseContext _context;

    public RepositoryBase(DiaperTrackerDatabaseContext context)
    {
        _context = context;
    }

    public virtual IQueryable<T> FindAll(CancellationToken token = default)
    {
        return _set.AsNoTracking();
    }

    public virtual async Task<T?> FindById(string id, CancellationToken token = default)
    {
        return await _set.FindAsync(new[] { id }, token);
    }

    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
    {
        return _set.Where(expression).AsNoTracking();
    }

    public virtual async Task<T> Create(T entity, CancellationToken token = default)
    {
        var result = await _set.AddAsync(entity, token);
        return result.Entity;
    }

    public virtual async Task<IEnumerable<T>> Create(IEnumerable<T> entities, CancellationToken token = default)
    {
        await _set.AddRangeAsync(entities, token);
        return entities;
    }

    public virtual Task<T> Update(T entity, CancellationToken token = default)
    {
        var result = _set.Update(entity);
        return Task.FromResult(result.Entity);
    }

    public virtual Task Delete(T entity, CancellationToken token = default)
    {
        _set.Remove(entity);
        return Task.CompletedTask;
    }
}
