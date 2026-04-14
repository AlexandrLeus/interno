using InternoApi.Models;
using InternoApi.Data;
using System.Security.Claims;
using InternoApi.Services;
using Microsoft.EntityFrameworkCore;
public class UserService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IFileService _fileService;

    public UserService(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor, IFileService fileService)
    {
        _context = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _fileService = fileService;
    }

    public User GetOrCreateCurrentUser()
    {
        var userClaims = _httpContextAccessor.HttpContext?.User;
        var keycloakId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = userClaims?.FindFirst("name")?.Value;
        var email = userClaims?.FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(keycloakId))
            throw new UnauthorizedAccessException("User not authenticated");

        var user = _context.Users.SingleOrDefault(u => u.KeycloakId == keycloakId);

        if (user == null)
        {
            user = new User
            {
                KeycloakId = keycloakId,
                Username = username!,
                Email = email!,
            };
            _context.Users.Add(user);
        }
        else
        {
            if (user.Username != username)
                user.Username = username!;

            if (user.Email != email)
                user.Email = email!;

            _context.Users.Update(user);
        }

        _context.SaveChanges();
        return user;
    }

    public async  Task<string> UploadOrUpdateAvatar(string keycloakId, IFormFile file)
    {
        var user = await _context.Users
    .FirstOrDefaultAsync(u => u.KeycloakId == keycloakId);

        if (user == null)
            throw new Exception("User not found");

        if (!string.IsNullOrEmpty(user.AvatarPublicId))
        {
            await _fileService.DeleteFileAsync(user.AvatarPublicId);
        }

        var (avatarUrl, publicId) = await _fileService.UploadAvatarAsync(file);

        user.AvatarUrl = avatarUrl;
        user.AvatarPublicId = publicId;
        await _context.SaveChangesAsync();

        return avatarUrl;

    }
}