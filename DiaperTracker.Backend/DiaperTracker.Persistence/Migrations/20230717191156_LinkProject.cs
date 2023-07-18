using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiaperTracker.Persistence.Migrations
{
    public partial class LinkProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "TaskType",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "Task",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TaskType_ProjectId",
                table: "TaskType",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Task_ProjectId",
                table: "Task",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Project_ProjectId",
                table: "Task",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskType_Project_ProjectId",
                table: "TaskType",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Task_Project_ProjectId",
                table: "Task");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskType_Project_ProjectId",
                table: "TaskType");

            migrationBuilder.DropIndex(
                name: "IX_TaskType_ProjectId",
                table: "TaskType");

            migrationBuilder.DropIndex(
                name: "IX_Task_ProjectId",
                table: "Task");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "TaskType");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Task");
        }
    }
}
