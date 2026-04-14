using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace internoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCloudinaryPublicId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "avatar_public_id",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "image_public_id",
                table: "blog_posts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "avatar_public_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "image_public_id",
                table: "blog_posts");
        }
    }
}
