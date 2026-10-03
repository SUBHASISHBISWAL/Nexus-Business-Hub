using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexusBusinessHub.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SyncCurrentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_CategoryId",
                table: "Products",
                columns: new[] { "IsActive", "CategoryId" })
                .Annotation("SqlServer:Include", new[] { "Name", "Price", "ImageUrl", "Rating", "StockQuantity" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_CategoryId",
                table: "Products");
        }
    }
}
