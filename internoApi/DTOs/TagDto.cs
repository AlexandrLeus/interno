using System.ComponentModel.DataAnnotations;
namespace InternoApi.DTOs
{
    public class TagDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        
    }
    
    public class CreateTagDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }

    }
    
    public class UpdateTagDto
    {
        [MaxLength(50)]
        public string? Name { get; set; }
        
        public bool? IsActive { get; set; }
    }
}