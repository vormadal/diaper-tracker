using DiaperTracker.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DiaperTracker.Persistence.Configurations;

public class TaskRecordConfiguration : IEntityTypeConfiguration<TaskRecord>
{
    public void Configure(EntityTypeBuilder<TaskRecord> builder)
    {
        builder.ToTable(nameof(Task));

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.Date);
        
        builder.HasOne(x => x.CreatedBy)
            .WithMany(x => x.TaskRecords)
            .HasForeignKey(x => x.CreatedById)
            .IsRequired();

        builder
            .HasOne(x => x.Type)
            .WithMany(x => x.Records)
            .HasForeignKey(x => x.TypeId)
            .IsRequired();
    }
}
