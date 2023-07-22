using DiaperTracker.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DiaperTracker.Persistence.Configurations;

public class ProjectMemberInviteConfiguration : IEntityTypeConfiguration<ProjectMemberInvite>
{
    public void Configure(EntityTypeBuilder<ProjectMemberInvite> builder)
    {
        builder.ToTable(nameof(ProjectMemberInvite));

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.Email).IsRequired();
        builder.Property(x => x.Status).IsRequired();
        builder.Property(x => x.CreatedOn).IsRequired();
        builder.Property(x => x.AcceptedOn);
        builder.Property(x => x.DeclinedOn);

        builder.HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId)
            .IsRequired();

        builder
            .HasOne(x => x.CreatedBy)
            .WithMany()
            .HasForeignKey(x => x.CreatedById)
            .IsRequired();

        builder
            .HasOne(x => x.AcceptedBy)
            .WithMany()
            .HasForeignKey(x => x.AcceptedById)
            .IsRequired(false);
    }
}
