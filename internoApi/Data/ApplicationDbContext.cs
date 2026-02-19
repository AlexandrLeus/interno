using Microsoft.EntityFrameworkCore;
using InternoApi.Models;

namespace InternoApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.ToTable("blog_posts");
                
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");
                
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("title");
                
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("description");
                
                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasMaxLength(10000)
                    .HasColumnName("content");
                
                entity.Property(e => e.ImageUrl)
                    .IsRequired()
                    .HasColumnName("image_url");
                
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .IsRequired(false);
                
                entity.HasMany(p => p.Tags)
                    .WithMany(t => t.BlogPosts)
                    .UsingEntity<Dictionary<string, object>>(
                        "blog_post_tags",  
                        j => j.HasOne<Tag>().WithMany().HasForeignKey("tag_id"),
                        j => j.HasOne<BlogPost>().WithMany().HasForeignKey("blog_post_id"),
                        j =>
                        {
                            j.HasKey("blog_post_id", "tag_id");
                            j.ToTable("blog_post_tags");
                            
                            j.HasIndex("tag_id").HasDatabaseName("idx_blog_post_tags_tag_id");
                            j.HasIndex("blog_post_id").HasDatabaseName("idx_blog_post_tags_blog_post_id");
                        });
                
                entity.HasMany(p => p.Categories)
                    .WithMany(c => c.BlogPosts)
                    .UsingEntity<Dictionary<string, object>>(
                        "blog_post_categories",  
                        j => j.HasOne<Category>().WithMany().HasForeignKey("category_id"),
                        j => j.HasOne<BlogPost>().WithMany().HasForeignKey("blog_post_id"),
                        j =>
                        {
                            j.HasKey("blog_post_id", "category_id");
                            j.ToTable("blog_post_categories");
                            
                            j.HasIndex("category_id").HasDatabaseName("idx_blog_post_categories_category_id");
                            j.HasIndex("blog_post_id").HasDatabaseName("idx_blog_post_categories_blog_post_id");
                        });
            });
            
            modelBuilder.Entity<Tag>(entity =>
            {
                entity.ToTable("tags");
                
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");
                
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("name");
                
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.IsActive)
                    .HasColumnName("is_active")
                    .HasDefaultValue(true);
                
                entity.HasIndex(e => e.Name)
                    .IsUnique()
                    .HasDatabaseName("idx_tags_name_unique");
            });
            
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");
                
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");
                
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("name");
                
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.IsActive)
                    .HasColumnName("is_active")
                    .HasDefaultValue(true);
                
                entity.HasIndex(e => e.Name)
                    .IsUnique()
                    .HasDatabaseName("idx_category_name_unique");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");

                entity.HasIndex(e => e.Email)
                    .IsUnique();

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("user_name");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("email");

                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("password_hash");

                entity.Property(e => e.Role)
                    .HasConversion<int>() 
                    .HasDefaultValue(UserRole.User)
                    .HasColumnName("role");

                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true)
                    .HasColumnName("is_active");
                    
                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("NOW()");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .IsRequired(false);
                    
            });
        }
    }
}