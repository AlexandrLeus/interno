namespace InternoApi.Services;
public interface IFileService
{
    Task<(string ImageUrl, string PublicId)> UploadBlogImageAsync(IFormFile file);
    Task<(string ImageUrl, string PublicId)> UploadAvatarAsync(IFormFile file);
    Task<bool> DeleteFileAsync(string publicId);
}