using Microsoft.EntityFrameworkCore.Migrations;

namespace Application.Migrations
{
    public partial class UpdatePersonTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PersonInformations",
                columns: table => new
                {
                    PersonId = table.Column<string>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    ZipCode = table.Column<string>(nullable: true),
                    Region = table.Column<string>(nullable: true),
                    Country = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonInformations", x => x.PersonId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonInformations");
        }
    }
}
