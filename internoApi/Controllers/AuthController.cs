using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth/[controller]")]
public class MeController : ControllerBase
{
    private readonly UserService _userService;

    public MeController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var user = _userService.GetOrCreateCurrentUser();

        return Ok(new
        {
            id = user.KeycloakId,
            username = user.Username,
            email = user.Email,
        });
    }

    [HttpGet("claims")]
    [Authorize]
    public IActionResult GetClaims()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value });
        return Ok(claims);
    }
}