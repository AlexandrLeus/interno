using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternoApi.DTOs;
using InternoApi.Services;
using System.Security.Claims;

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

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetMe()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        try
        {
            var user = await _authService.GetUserById(userId);
            return Ok(user); 
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "User not found" });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        try
        {
            var (authDto, refreshToken) = await _authService.Authenticate(loginDto);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = loginDto.RememberMe
                ? DateTime.UtcNow.AddDays(30)
                : DateTime.UtcNow.AddDays(1)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

            _logger.LogInformation("User {Email} logged in successfully", authDto.User.Email);

            return Ok(authDto);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Login failed for {Email}: {Message}", loginDto.Email, ex.Message);
            return Unauthorized(new { ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Email}", loginDto.Email);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("register")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        try
        {
            var (authDto, refreshToken) = await _authService.Register(registerDto);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(1)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

            _logger.LogInformation("New user {Email} registered by admin", authDto.User.Email);

            return Ok(authDto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<RefreshTokenDto>> Refresh()
    {
        try
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "Refresh token missing" });

            var (newAccessToken, newRefreshToken) = await _authService.RefreshToken(refreshToken);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            };
            Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

            return Ok(new RefreshTokenDto { AccessToken = newAccessToken });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.RevokeRefreshToken(refreshToken);
        }

        Response.Cookies.Delete("refreshToken");

        return Ok();
    }

}