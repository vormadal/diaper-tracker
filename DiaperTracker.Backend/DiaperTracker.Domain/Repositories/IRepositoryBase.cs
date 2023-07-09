using System.Linq.Expressions;

namespace DiaperTracker.Domain.Repositories;

public interface IRepositoryBase<T> where T : class
{
    Task<T?> FindById(string id, CancellationToken token);
    Task<T> Create(T entity, CancellationToken token);
    Task<IEnumerable<T>> Create(IEnumerable<T> entities, CancellationToken token);
    IQueryable<T> FindAll(CancellationToken token);
    IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
    Task<T> Update(T entity, CancellationToken token);
}
