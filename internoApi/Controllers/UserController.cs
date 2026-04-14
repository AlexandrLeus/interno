using InternoApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ApplicationDbContext _context;
    public UserController(UserService userService, ApplicationDbContext context)
    {
        _userService = userService;
        _context = context;
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var user = _userService.GetOrCreateCurrentUser();

        return Ok(new
        {
            id = user.KeycloakId,
            username = user.Username,
            email = user.Email,
            avatar = user.AvatarUrl,
        });
    }

    [HttpGet("claims")]
    [Authorize]
    public IActionResult GetClaims()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value });
        return Ok(claims);
    }

    [HttpPost("avatar")]
    [Authorize]
    public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarDto file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var avatarUrl = await _userService.UploadOrUpdateAvatar(userId, file.Avatar);

        return Ok(avatarUrl);
    }

}