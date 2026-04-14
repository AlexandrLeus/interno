namespace InternoApi.Models;
public class User
{
    public int Id { get; set; }
    public string KeycloakId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string? AvatarPublicId { get; set; }
    public ICollection<BlogPost> Posts { get; set; } = new List<BlogPost>();
}
