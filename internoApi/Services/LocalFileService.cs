namespace InternoApi.Services;

public class LocalFileService : IFileService
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _configuration;
    private readonly string _uploadPath;
    private readonly string _baseUrl;

    public LocalFileService(IWebHostEnvironment env, IConfiguration configuration)
    {
        _env = env;
        _configuration = configuration;
        _uploadPath = Path.Combine(_env.WebRootPath, "uploads");
        _baseUrl = _configuration["BaseUrl"] ?? "http://localhost:5031";

        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<string> SaveFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        var folderPath = Path.Combine(_uploadPath, subFolder);
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);
            
        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"{_baseUrl}/uploads/{subFolder}/{fileName}";
    }
    public async Task<(string ImageUrl, string PublicId)> UploadAvatarAsync(IFormFile file)
    {
        var url = await SaveFileAsync(file, "avatars");
        var publicId = $"avatars/{Path.GetFileName(url)}";
        return (url, publicId);
    }
    public async Task<(string ImageUrl, string PublicId)> UploadBlogImageAsync(IFormFile file)
    {
        var url = await SaveFileAsync(file, "blog_posts");
        var publicId = $"blog_posts/{Path.GetFileName(url)}";
        return (url, publicId);
    }
    public async Task<bool> DeleteFileAsync(string publicId)
    {
        var filePath = Path.Combine(_uploadPath, publicId);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
            return true;
        }
        return false;
    }
}