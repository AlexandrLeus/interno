using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace internoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUserToPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "blog_posts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_blog_posts_user_id",
                table: "blog_posts",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_blog_posts_users_user_id",
                table: "blog_posts",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_blog_posts_users_user_id",
                table: "blog_posts");

            migrationBuilder.DropIndex(
                name: "IX_blog_posts_user_id",
                table: "blog_posts");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "blog_posts");
        }
    }
}
