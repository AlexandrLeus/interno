using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace InternoApi.Services
{
    public class CloudinaryService : IFileService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
        {
            _logger = logger;

            try
            {
                var cloudName = configuration["Cloudinary:CloudName"] ?? Environment.GetEnvironmentVariable("CLOUDINARY_NAME");
                var apiKey = configuration["Cloudinary:ApiKey"] ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
                var apiSecret = configuration["Cloudinary:ApiSecret"] ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

                if (string.IsNullOrEmpty(cloudName) ||
                    string.IsNullOrEmpty(apiKey) ||
                    string.IsNullOrEmpty(apiSecret))
                {
                    throw new InvalidOperationException("Cloudinary credentials not configured");
                }

                var account = new Account(cloudName, apiKey, apiSecret);
                _cloudinary = new Cloudinary(account);
                _cloudinary.Api.Secure = true;

                _logger.LogInformation("Cloudinary initialized for cloud: {CloudName}", cloudName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Cloudinary");
                throw;
            }
        }

        private async Task<ImageUploadResult> UploadAsync(ImageUploadParams uploadParams)
        {
            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
            {
                _logger.LogError("Cloudinary error: {Error}", result.Error.Message);
                throw new Exception($"Upload failed: {result.Error.Message}");
            }

            return result;
        }
        public async Task<(string ImageUrl, string PublicId)> UploadBlogImageAsync(IFormFile file)
        {

            ValidateFile(file);

            _logger.LogInformation("Uploading {FileName} ({FileSize} bytes)", file.FileName, file.Length);

            using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation()
                    .Quality("auto")
                    .FetchFormat("auto"),

                PublicId = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
                Folder = "blog_posts",
                Overwrite = false,
                Tags = "blog,interno"
            };

            var result = await UploadAsync(uploadParams);

            _logger.LogInformation("File uploaded successfully. PublicId: {PublicId}", result.PublicId);

            return (result.SecureUrl.ToString(), result.PublicId);
        }

        public async Task<(string ImageUrl, string PublicId)> UploadAvatarAsync(IFormFile file)
        {
            ValidateFile(file);

            using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),

                PublicId = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
                Folder = "avatars",

                Overwrite = true,

                Transformation = new Transformation()
                    .Width(300)
                    .Height(300)
                    .Crop("fill")
                    .Gravity("face")
                    .Quality("auto")
                    .FetchFormat("auto"),

                Tags = "avatar,user"
            };

            var result = await UploadAsync(uploadParams);

            return (result.SecureUrl.ToString(), result.PublicId);
        }

        public async Task<bool> DeleteFileAsync(string publicId)
        {
            try
            {   
                if (string.IsNullOrEmpty(publicId))
                {
                    _logger.LogWarning("publicId is empty");
                    return false;
                }

                _logger.LogInformation("Deleting file: {PublicId}", publicId);

                var deleteParams = new DeletionParams(publicId);
                var result = await _cloudinary.DestroyAsync(deleteParams);

                if (result.Error != null)
                {
                    _logger.LogError("Delete error: {Error}", result.Error.Message);
                    return false;
                }

                _logger.LogInformation("File deleted successfully. Result: {Result}", result.Result);
                return result.Result == "ok";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting from Cloudinary");
                return false;
            }
        }

        private void ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            if (file.Length > 5 * 1024 * 1024)
                throw new ArgumentException("File size cannot exceed 5MB");

            var allowedTypes = new[] {
                "image/jpeg", "image/png", "image/webp",
                "image/jpg", "image/bmp", "image/tiff"
            };

            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                throw new ArgumentException("Only images are allowed");
        }
    }
}