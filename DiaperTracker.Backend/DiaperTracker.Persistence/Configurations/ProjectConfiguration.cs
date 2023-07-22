using DiaperTracker.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DiaperTracker.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable(nameof(Project));

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.Name);

        builder.Property(x => x.IsDeleted)
            .HasDefaultValue(false);

        builder
            .HasMany(x => x.Members)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.Id)
            .IsRequired();
    }
}
