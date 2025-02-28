using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace budget_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExpenseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_AspNetUsers_user_id",
                table: "Expenses");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Expenses",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Expenses",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "currency",
                table: "Expenses",
                newName: "Currency");

            migrationBuilder.RenameColumn(
                name: "category",
                table: "Expenses",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "amount",
                table: "Expenses",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Expenses",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "create_time",
                table: "Expenses",
                newName: "CreateTime");

            migrationBuilder.RenameIndex(
                name: "IX_Expenses_user_id",
                table: "Expenses",
                newName: "IX_Expenses_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_AspNetUsers_UserId",
                table: "Expenses",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_AspNetUsers_UserId",
                table: "Expenses");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Expenses",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Expenses",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Currency",
                table: "Expenses",
                newName: "currency");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Expenses",
                newName: "category");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "Expenses",
                newName: "amount");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Expenses",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "CreateTime",
                table: "Expenses",
                newName: "create_time");

            migrationBuilder.RenameIndex(
                name: "IX_Expenses_UserId",
                table: "Expenses",
                newName: "IX_Expenses_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_AspNetUsers_user_id",
                table: "Expenses",
                column: "user_id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
