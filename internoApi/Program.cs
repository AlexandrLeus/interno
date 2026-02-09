using Microsoft.EntityFrameworkCore;
using InternoApi.Data;
using DotNetEnv;

if (File.Exists(".env"))
{
    Env.Load(); 
}

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{

    var host = Environment.GetEnvironmentVariable("DB_HOST");
    var port = Environment.GetEnvironmentVariable("DB_PORT");
    var database = Environment.GetEnvironmentVariable("DB_NAME");
    var username = Environment.GetEnvironmentVariable("DB_USER");
    var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
    
    connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS");
var corsOrigins = allowedOrigins?.Split(',', StringSplitOptions.RemoveEmptyEntries) 
    ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp",
        policy => policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});


var app = builder.Build();

var enableSwagger = Environment.GetEnvironmentVariable("ENABLE_SWAGGER")?.ToLower() == "true";
if (app.Environment.IsDevelopment() || enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var forceHttps = Environment.GetEnvironmentVariable("FORCE_HTTPS")?.ToLower() == "true";
if (forceHttps || !app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();

