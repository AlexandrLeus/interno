using System.ComponentModel.DataAnnotations;
namespace InternoApi.DTOs
{
    public class BlogPostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
        public List<int> CategoryIds { get; set; } = new List<int>();
    }

    public class SearchBlogPostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
    public class BlogPostDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
        public List<TagDto> Tags { get; set; } = new List<TagDto>();
        public List<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
    }
    public class CreateBlogPostDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10000)]
        public string Content { get; set; } = string.Empty;
        
        [Url]
        public string ImageUrl { get; set; } = string.Empty;
        public List<int> TagIds { get; set; } = new List<int>();
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
    public class UpdateBlogPostDto
    {
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(10000)]
        public string? Content { get; set; }
        
        [Url]
        public string? ImageUrl { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}