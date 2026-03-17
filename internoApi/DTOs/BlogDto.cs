using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
namespace InternoApi.DTOs
{
    public class BlogPostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int AuthorId { get; set; }
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
        public int AuthorId { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<TagDto> Tags { get; set; } = new List<TagDto>();
        public List<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
    }
    public class CreateBlogPostDto
    {
        [Required]
        [StringLength(200)]
        [BindProperty(Name = "title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        [BindProperty(Name = "description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(10000)]
        [BindProperty(Name = "content")]
        public string Content { get; set; } = string.Empty;
        [Required]
        [BindProperty(Name = "image")]
        public IFormFile? Image { get; set; }
        [Required]
        [BindProperty(Name = "tagIds")]
        public List<int>? TagIds { get; set; }
        [Required]
        [BindProperty(Name = "categoryIds")]
        public List<int>? CategoryIds { get; set; }
    }
    public class UpdateBlogPostDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(10000)]
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public List<int>? TagIds { get; set; }
        public List<int>? CategoryIds { get; set; }
    }
}