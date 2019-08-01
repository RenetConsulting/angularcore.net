using Microsoft.EntityFrameworkCore.Migrations;

namespace Application.Migrations
{
    public partial class RemoveEditable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Editable",
                table: "Blogs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Editable",
                table: "Blogs",
                nullable: false,
                defaultValue: false);
        }
    }
}
