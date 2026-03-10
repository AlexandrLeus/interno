using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using InternoApi.Models;
using InternoApi.Data;
using InternoApi.DTOs;
using Microsoft.EntityFrameworkCore;

namespace InternoApi.Services;

public interface IAuthService
{
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
    Task<UserDto> GetUserById(int userId);
    Task<(AuthResponseDto, string RefreshToken)> Authenticate(LoginDto loginDto);
    Task<(AuthResponseDto AuthDto, string RefreshToken)> Register(RegisterDto registerDto);
    Task<(string accessToken, string refreshToken)> RefreshToken(string refreshToken);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthService(IConfiguration configuration, ApplicationDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    public string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(
            jwtSettings["Secret"]
            ?? Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new InvalidOperationException("JWT Secret not configured")
        );

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            Issuer = jwtSettings["Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER"),
            Audience = jwtSettings["Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    public string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    public async Task<(AuthResponseDto, string RefreshToken)> Authenticate(LoginDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

        if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid username or password");

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = loginDto.RememberMe
            ? DateTime.UtcNow.AddDays(30)
            : DateTime.UtcNow.AddDays(1);

        await _context.SaveChangesAsync();

        var authDto = new AuthResponseDto
        {
            Token = accessToken,
            ExpiresAt = DateTime.UtcNow.AddDays(1),
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        };

        return (authDto, refreshToken);
    }
    public async Task<(string accessToken, string refreshToken)> RefreshToken(string refreshToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken
                && u.RefreshTokenExpiryTime > DateTime.UtcNow
                && u.IsActive);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid or expired refresh token");

        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await _context.SaveChangesAsync();

        return (newAccessToken, newRefreshToken);
    }

    public async Task<(AuthResponseDto AuthDto, string RefreshToken)> Register(RegisterDto registerDto)
    {
        if (await _context.Users.Where(u => u.Email == registerDto.Email).AnyAsync())
            throw new ArgumentException("Email already exists");

        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = HashPassword(registerDto.Password),
            Role = registerDto.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var authDto = new AuthResponseDto
        {
            Token = accessToken,
            ExpiresAt = DateTime.UtcNow.AddDays(1),
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        };

        return (authDto, refreshToken);

    }
    public async Task<UserDto> GetUserById(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == passwordHash;
    }
}