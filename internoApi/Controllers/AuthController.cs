using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternoApi.DTOs;
using InternoApi.Services;

namespace InternoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        try
        {
            var user = await _authService.Authenticate(loginDto.Email, loginDto.Password);
            
            if (user == null)
                return Unauthorized();

            if (!user.IsActive)
                return Unauthorized(new { message = "Account is deactivated" });

            var token = _authService.GenerateJwtToken(user);

            _logger.LogInformation("User {Username} logged in successfully", user.Email);

            return Ok(new AuthResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role.ToString()
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Username}", loginDto.Email);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("register")]
    [Authorize(Policy = "AdminOnly")] 
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        try
        {
            var user = await _authService.Register(registerDto);
            var token = _authService.GenerateJwtToken(user);

            _logger.LogInformation("New user {Username} registered by admin", user.Username);

            return Ok(new AuthResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role.ToString()
                }
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    // [HttpGet("me")]
    // [Authorize] // Любой аутентифицированный пользователь
    // public IActionResult GetCurrentUser()
    // {
    //     var user = new UserDto
    //     {
    //         Id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0"),
    //         Username = User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty,
    //         Email = User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,
    //         Role = User.FindFirst(user.Role)?.Value ?? "User"
    //     };

    //     return Ok(user);
    // }

}