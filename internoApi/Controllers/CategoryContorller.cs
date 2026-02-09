using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InternoApi.Models;
using InternoApi.Data;
using InternoApi.DTOs;

namespace InternoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategory()
        {
            var categories = await _context.Categories
            .Where(t => t.IsActive)
            .Select(t => new CategoryDto
            {
                Id = t.Id,
                Name = t.Name,
                CreatedAt = t.CreatedAt,
                IsActive = t.IsActive
            })
                    .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Categories
            .Where(t => t.IsActive)
            .Select(t => new CategoryDto
            {
                Id = t.Id,
                Name = t.Name,
                CreatedAt = t.CreatedAt,
                IsActive = t.IsActive
            })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createDto)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(t => t.Name.ToLower() == createDto.Name.ToLower());

            if (existingCategory != null)
            {
                return Conflict(new { Message = $"A category named '{createDto.Name}' already exists" });
            }

            var category = new Category
            {
                Name = createDto.Name.Trim(),
                IsActive = createDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                IsActive = category.IsActive
            };

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatetCategory(int id, UpdateCategoryDto updateDto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            if (updateDto.Name != null)
            {
                var trimmedName = updateDto.Name.Trim();

                var nameExists = await _context.Categories
                    .AnyAsync(t => t.Name.ToLower() == trimmedName.ToLower());

                if (nameExists)
                {
                    return Conflict(new
                    {
                        Message = $"A category named '{trimmedName}' already exists",
                    });
                }

                category.Name = trimmedName;
            }

            if (updateDto.IsActive.HasValue)
            {
                category.IsActive = updateDto.IsActive.Value;
            }

            await _context.SaveChangesAsync();

            var categoryDto = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                IsActive = category.IsActive
            };

            return Ok(categoryDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
