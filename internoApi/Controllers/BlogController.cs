using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InternoApi.Models;
using InternoApi.Data;
using InternoApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using InternoApi.Services;
using System.Security.Claims;

namespace InternoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileService _fileService;

        public BlogController(ApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetBlogPosts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6,
            [FromQuery] int? tag = null,
            [FromQuery] int? category = null,
            [FromQuery] string? author = null)

        {

            var query = _context.BlogPosts
            .Include(p => p.Tags)
            .Include(p => p.Categories)
            .AsQueryable();

            if (tag.HasValue)
            {
                query = query.Where(p => p.Tags.Any(t => t.Id == tag.Value));
            }

            if (category.HasValue)
            {
                query = query.Where(p => p.Categories.Any(c => c.Id == category.Value));
            }

            if (!string.IsNullOrEmpty(author))
            {
                query = query.Where(p => p.UserId == author);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new BlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    AuthorId = p.UserId,
                    CreatedAt = p.CreatedAt,
                    TagIds = p.Tags.Select(t => t.Id).ToList(),
                    CategoryIds = p.Categories.Select(c => c.Id).ToList()
                })
                .ToListAsync();

            var result = new
            {
                TotalItems = totalCount,
                TotalPages = totalPages,
                Page = page,
                PageSize = pageSize,
                Items = posts
            };

            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<SearchBlogPostDto>> SearchPosts(
            [FromQuery] string q,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            {
                return BadRequest("Search query must be at least 2 characters");
            }

            var query = _context.BlogPosts
                .Where(p =>
                    p.Title.Contains(q) ||
                    p.Description.Contains(q) ||
                    p.Content.Contains(q) ||
                    p.Tags.Any(t => t.Name.Contains(q)));

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var posts = await query
                .OrderByDescending(p => p.Title.Contains(q) ? 2 : 0)
                .ThenByDescending(p => p.Description.Contains(q) ? 1 : 0)
                .ThenByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new SearchBlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                })
                .ToListAsync();

            var result = new
            {
                TotalItems = totalCount,
                TotalPages = totalPages,
                Page = page,
                PageSize = pageSize,
                Items = posts
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostDetailDto>> GetBlogPost(int id)
        {
            var blogPost = await _context.BlogPosts
            .Where(p => p.Id == id)
            .Select(p => new BlogPostDetailDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                AuthorId = p.UserId,
                Tags = p.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    IsActive = t.IsActive
                }).ToList(),
                Categories = p.Categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    IsActive = c.IsActive
                }).ToList()
            }).FirstOrDefaultAsync();

            if (blogPost == null)
            {
                return NotFound();
            }

            return Ok(blogPost);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BlogPostDto>> CreateBlogPost([FromForm] CreateBlogPostDto createDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var blogPost = new BlogPost
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Content = createDto.Content,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
            };
            if (createDto.Image != null && createDto.Image.Length > 0)
            {
                (blogPost.ImageUrl, blogPost.ImagePublicId) = await _fileService.UploadBlogImageAsync(createDto.Image);
            }
            if (createDto.TagIds?.Any() == true)
            {
                if (createDto.TagIds.Contains(0))
                {
                    return BadRequest("Tag ID cannot be 0");
                }

                var tagsToAdd = await _context.Tags
                    .Where(t => createDto.TagIds.Contains(t.Id) && t.IsActive)
                    .ToListAsync();

                blogPost.Tags = tagsToAdd;
            }

            if (createDto.CategoryIds?.Any() == true)
            {
                if (createDto.CategoryIds.Contains(0))
                {
                    return BadRequest("Category ID cannot be 0");
                }

                var CategoryToAdd = await _context.Categories
                    .Where(t => createDto.CategoryIds.Contains(t.Id) && t.IsActive)
                    .ToListAsync();

                blogPost.Categories = CategoryToAdd;
            }

            _context.BlogPosts.Add(blogPost);
            await _context.SaveChangesAsync();

            var result = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                Description = blogPost.Description,
                ImageUrl = blogPost.ImageUrl,
                CreatedAt = blogPost.CreatedAt,
                TagIds = blogPost.Tags.Select(t => t.Id).ToList(),
                CategoryIds = blogPost.Categories.Select(c => c.Id).ToList()
            };

            return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateBlogPost(int id, [FromForm] UpdateBlogPostDto updateDto)
        {
            var blogPost = await _context.BlogPosts.Include(p => p.Tags)
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(p => p.Id == id);

            if (blogPost == null)
            {
                return NotFound();
            }

            var UserId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var isAdmin = User.IsInRole("Admin");

            if (blogPost.UserId != UserId && !isAdmin)
            {
                return Forbid();
            }

            if (updateDto.Title != null)
                blogPost.Title = updateDto.Title;

            if (updateDto.Description != null)
                blogPost.Description = updateDto.Description;

            if (updateDto.Content != null)
                blogPost.Content = updateDto.Content;

            if (updateDto.Image != null)
            {
                if (!string.IsNullOrEmpty(blogPost.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(blogPost.ImageUrl);
                    await _fileService.DeleteFileAsync(oldFileName);
                }
                (blogPost.ImageUrl, blogPost.ImagePublicId) = await _fileService.UploadBlogImageAsync(updateDto.Image);
            }

            if (updateDto.TagIds != null)
            {
                var newTags = await _context.Tags
                    .Where(t => updateDto.TagIds.Contains(t.Id))
                    .ToListAsync();
                if (newTags.Count != updateDto.TagIds.Count)
                {
                    var missingIds = updateDto.TagIds.Except(newTags.Select(t => t.Id));
                    throw new Exception($"Invalid tags: {string.Join(", ", missingIds)}");
                }
                blogPost.Tags = newTags;
            }
            if (updateDto.CategoryIds != null)
            {
                var newCategories = await _context.Categories
                    .Where(c => updateDto.CategoryIds.Contains(c.Id))
                    .ToListAsync();
                if (newCategories.Count != updateDto.CategoryIds.Count)
                {
                    var missingIds = updateDto.CategoryIds.Except(newCategories.Select(t => t.Id));
                    throw new Exception($"Invalid tags: {string.Join(", ", missingIds)}");
                }
                blogPost.Categories = newCategories;
            }

            blogPost.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.BlogPosts.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            var blogPost = await _context.BlogPosts.Include(p => p.Tags)
            .Include(p => p.Categories)
            .FirstOrDefaultAsync(p => p.Id == id);
            if (blogPost == null)
            {
                return NotFound();
            }
            var UserId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var isAdmin = User.IsInRole("Admin");

            if (blogPost.UserId != UserId && !isAdmin)
            {
                return Forbid();
            }
            if (!string.IsNullOrEmpty(blogPost.ImageUrl))
            {
                var fileName = Path.GetFileName(blogPost.ImageUrl);
                await _fileService.DeleteFileAsync(fileName);
            }
            blogPost.Tags.Clear();
            blogPost.Categories.Clear();
            _context.BlogPosts.Remove(blogPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}