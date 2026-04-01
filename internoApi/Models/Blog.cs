namespace InternoApi.Models
{
    public class BlogPost
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
        
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        
        public ICollection<Category> Categories { get; set; } = new List<Category>();

        public string UserId { get; set; } = null!;

        public User? User { get; set; }
    }
}