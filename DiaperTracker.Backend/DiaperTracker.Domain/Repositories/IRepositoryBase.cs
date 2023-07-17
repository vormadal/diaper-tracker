using System.Linq.Expressions;

namespace DiaperTracker.Domain.Repositories;

public interface IRepositoryBase<T> where T : class
{
    Task<T?> FindById(string id, CancellationToken token = default);
    Task<T> Create(T entity, CancellationToken token = default);
    Task<IEnumerable<T>> Create(IEnumerable<T> entities, CancellationToken token = default);
    IQueryable<T> FindAll(CancellationToken token = default);
    IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
    Task<T> Update(T entity, CancellationToken token = default);
}
