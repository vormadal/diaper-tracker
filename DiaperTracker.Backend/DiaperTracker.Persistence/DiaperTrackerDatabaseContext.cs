using Duende.IdentityServer.EntityFramework.Options;
using DiaperTracker.Domain;
using DiaperTracker.Persistence.Configurations;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DiaperTracker.Persistence;

public class DiaperTrackerDatabaseContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public DbSet<TaskType> TaskTypes { get; set; }

    public DbSet<TaskRecord> Tasks { get; set; }

    public DiaperTrackerDatabaseContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TaskTypeConfiguration).Assembly);
    }
}
