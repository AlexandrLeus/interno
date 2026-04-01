using InternoApi.Models;
using InternoApi.Data;
using System.Security.Claims;
public class UserService
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _context = dbContext;
        _httpContextAccessor = httpContextAccessor;
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
            _context.SaveChanges();
        }

        return user;
    }
}