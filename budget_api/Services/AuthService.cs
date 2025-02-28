using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Budget.DB.Models;
using Microsoft.IdentityModel.Tokens;

namespace Budget.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(AspNetUser user)
        {
            var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim (JwtRegisteredClaimNames.Sub, user.UserName!),
            new Claim (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Aud, _configuration["Jwt:Audience"]!)
        };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: creds
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}