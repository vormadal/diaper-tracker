using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiaperTracker.Persistence.Migrations
{
    public partial class AcceptedByOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMemberInvite_AspNetUsers_AcceptedById",
                table: "ProjectMemberInvite");

            migrationBuilder.AlterColumn<string>(
                name: "AcceptedById",
                table: "ProjectMemberInvite",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMemberInvite_AspNetUsers_AcceptedById",
                table: "ProjectMemberInvite",
                column: "AcceptedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMemberInvite_AspNetUsers_AcceptedById",
                table: "ProjectMemberInvite");

            migrationBuilder.AlterColumn<string>(
                name: "AcceptedById",
                table: "ProjectMemberInvite",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMemberInvite_AspNetUsers_AcceptedById",
                table: "ProjectMemberInvite",
                column: "AcceptedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
