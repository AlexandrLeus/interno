using InternoApi.Models;
using InternoApi.Services;
using Microsoft.EntityFrameworkCore;

namespace InternoApi.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        try
        {
            await context.Database.MigrateAsync();

            if (!await context.Users.AnyAsync())
            {
                logger.LogInformation("No users found. Creating admin user...");

                var adminSection = configuration.GetSection("Admin");
                
                var adminUsername = adminSection["Username"] ?? Environment.GetEnvironmentVariable("ADMIN_USERNAME");
                var adminPassword = adminSection["Password"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
                var adminEmail = adminSection["Email"] ?? Environment.GetEnvironmentVariable("ADMIN_EMAIL");

                if (string.IsNullOrEmpty(adminUsername))
                    throw new InvalidOperationException("Admin:Username is not configured in app settings or environment variables");
                
                if (string.IsNullOrEmpty(adminPassword))
                    throw new InvalidOperationException("Admin:Password is not configured in app settings or environment variables");
                
                if (string.IsNullOrEmpty(adminEmail))
                    throw new InvalidOperationException("Admin:Email is not configured in app settings or environment variables");

                var admin = new User
                {
                    Username = adminUsername,
                    Email = adminEmail,
                    PasswordHash = authService.HashPassword(adminPassword),
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(admin);
                await context.SaveChangesAsync();

                logger.LogInformation("Admin user created successfully");
            }

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during database seeding");
            throw;
        }
    }
}