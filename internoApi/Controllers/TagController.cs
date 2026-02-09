using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InternoApi.Models;
using InternoApi.Data;
using InternoApi.DTOs;

namespace InternoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TagController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
        {
            var tags = await _context.Tags
            .Where(t => t.IsActive)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                CreatedAt = t.CreatedAt,
                IsActive = t.IsActive
            })
                    .ToListAsync();

            return Ok(tags);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(int id)
        {
            var tag = await _context.Tags
            .Where(t => t.IsActive)
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                CreatedAt = t.CreatedAt,
                IsActive = t.IsActive
            })
                .FirstOrDefaultAsync();

            if (tag == null)
            {
                return NotFound();
            }

            return Ok(tag);
        }

        [HttpPost]
        public async Task<ActionResult<TagDto>> CreateTag(CreateTagDto createDto)
        {
            var existingTag = await _context.Tags.FirstOrDefaultAsync(t => t.Name.ToLower() == createDto.Name.ToLower());

            if (existingTag != null)
            {
                return Conflict(new { Message = $"A tag named '{createDto.Name}' already exists" });
            }

            var tag = new Tag
            {
                Name = createDto.Name.Trim(),
                IsActive = createDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            var tagDto = new TagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                CreatedAt = tag.CreatedAt,
                IsActive = tag.IsActive
            };

            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tagDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatetTag(int id, UpdateTagDto updateDto)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            if (updateDto.Name != null)
            {
                var trimmedName = updateDto.Name.Trim();

                var nameExists = await _context.Tags
                    .AnyAsync(t => t.Name.ToLower() == trimmedName.ToLower());

                if (nameExists)
                {
                    return Conflict(new
                    {
                        Message = $"A tag named '{trimmedName}' already exists",
                    });
                }

                tag.Name = trimmedName;
            }

            if (updateDto.IsActive.HasValue)
            {
                tag.IsActive = updateDto.IsActive.Value;
            }

            await _context.SaveChangesAsync();

            var tagDto = new TagDto
            {
                Id = tag.Id,
                Name = tag.Name,
                CreatedAt = tag.CreatedAt,
                IsActive = tag.IsActive
            };

            return Ok(tagDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
