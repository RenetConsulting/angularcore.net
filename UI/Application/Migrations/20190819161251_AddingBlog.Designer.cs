using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Application.Migrations
{
    public partial class AddingBlogDesigner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OpenIddictTokens_ApplicationId",
                table: "OpenIddictTokens");

            migrationBuilder.DropIndex(
                name: "IX_OpenIddictAuthorizations_ApplicationId",
                table: "OpenIddictAuthorizations");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "OpenIddictTokens",
                maxLength: 25,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "OpenIddictTokens",
                maxLength: 450,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "OpenIddictTokens",
                maxLength: 25,
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReferenceId",
                table: "OpenIddictTokens",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictTokens",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "OpenIddictScopes",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictScopes",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "OpenIddictAuthorizations",
                maxLength: 25,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "OpenIddictAuthorizations",
                maxLength: 450,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "OpenIddictAuthorizations",
                maxLength: 25,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictAuthorizations",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "OpenIddictApplications",
                maxLength: 25,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictApplications",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "OpenIddictApplications",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AspNetUserTokens",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserTokens",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "ProviderKey",
                table: "AspNetUserLogins",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserLogins",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    BlogId = table.Column<string>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "DateTime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedDate = table.Column<DateTime>(type: "DateTime2", nullable: true, computedColumnSql: "GETDATE()"),
                    IsActive = table.Column<bool>(nullable: false, defaultValueSql: "1"),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    CreatedBy = table.Column<string>(maxLength: 450, nullable: false),
                    UpdatedBy = table.Column<string>(maxLength: 450, nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Content = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(maxLength: 450, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.BlogId);
                    table.ForeignKey(
                        name: "FK_Blogs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FileStorages",
                columns: table => new
                {
                    FileId = table.Column<string>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "DateTime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedDate = table.Column<DateTime>(type: "DateTime2", nullable: true, computedColumnSql: "GETDATE()"),
                    IsActive = table.Column<bool>(nullable: false, defaultValueSql: "1"),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    CreatedBy = table.Column<string>(maxLength: 450, nullable: false),
                    UpdatedBy = table.Column<string>(maxLength: 450, nullable: true),
                    Url = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(maxLength: 450, nullable: true),
                    BlogId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileStorages", x => x.FileId);
                    table.ForeignKey(
                        name: "FK_FileStorages_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "BlogId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FileStorages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictTokens_ApplicationId_Status_Subject_Type",
                table: "OpenIddictTokens",
                columns: new[] { "ApplicationId", "Status", "Subject", "Type" });

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictAuthorizations_ApplicationId_Status_Subject_Type",
                table: "OpenIddictAuthorizations",
                columns: new[] { "ApplicationId", "Status", "Subject", "Type" });

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_UserId",
                table: "Blogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FileStorages_BlogId",
                table: "FileStorages",
                column: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_FileStorages_UserId",
                table: "FileStorages",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FileStorages");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_OpenIddictTokens_ApplicationId_Status_Subject_Type",
                table: "OpenIddictTokens");

            migrationBuilder.DropIndex(
                name: "IX_OpenIddictAuthorizations_ApplicationId_Status_Subject_Type",
                table: "OpenIddictAuthorizations");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "OpenIddictTokens",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 25);

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "OpenIddictTokens",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 450);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "OpenIddictTokens",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 25);

            migrationBuilder.AlterColumn<string>(
                name: "ReferenceId",
                table: "OpenIddictTokens",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictTokens",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "OpenIddictScopes",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictScopes",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "OpenIddictAuthorizations",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 25);

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "OpenIddictAuthorizations",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 450);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "OpenIddictAuthorizations",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 25);

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictAuthorizations",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "OpenIddictApplications",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 25);

            migrationBuilder.AlterColumn<string>(
                name: "ConcurrencyToken",
                table: "OpenIddictApplications",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "OpenIddictApplications",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AspNetUserTokens",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserTokens",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "ProviderKey",
                table: "AspNetUserLogins",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserLogins",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictTokens_ApplicationId",
                table: "OpenIddictTokens",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictAuthorizations_ApplicationId",
                table: "OpenIddictAuthorizations",
                column: "ApplicationId");
        }
    }
}
