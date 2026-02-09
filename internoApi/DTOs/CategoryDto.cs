using System.ComponentModel.DataAnnotations;
namespace InternoApi.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }

    }
    
    public class CreateCategoryDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        public bool IsActive { get; set; }
        
    }
    
    public class UpdateCategoryDto
    {
        [MaxLength(50)]
        public string? Name { get; set; }
        
        public bool? IsActive { get; set; }
    }
}