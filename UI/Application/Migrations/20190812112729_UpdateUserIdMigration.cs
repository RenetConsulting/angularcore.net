// <copyright file="20190812112729_UpdateUserIdMigration.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class UpdateUserIdMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "FileStorages",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FileStorages_UserId",
                table: "FileStorages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileStorages_AspNetUsers_UserId",
                table: "FileStorages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileStorages_AspNetUsers_UserId",
                table: "FileStorages");

            migrationBuilder.DropIndex(
                name: "IX_FileStorages_UserId",
                table: "FileStorages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FileStorages");
        }
    }
}
