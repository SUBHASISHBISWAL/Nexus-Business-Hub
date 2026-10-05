using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexusBusinessHub.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProductPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_CreatedAt_Id",
                table: "Products",
                columns: new[] { "IsActive", "CreatedAt", "Id" },
                descending: new[] { false, true, true });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_StockQuantity",
                table: "Products",
                columns: new[] { "IsActive", "StockQuantity" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_CreatedAt_Id",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_StockQuantity",
                table: "Products");
        }
    }
}
