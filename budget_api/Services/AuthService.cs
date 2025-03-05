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
            Console.WriteLine("Generating JWT token");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var handler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = GenerateClaims(user),
                NotBefore = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = creds,
                Issuer = _configuration["Jwt:Issuer"] ?? "budget-api",
                Audience = _configuration["Jwt:Audience"] ?? "budget-frontend",
                AdditionalHeaderClaims = new Dictionary<string, object>
                {
                    { "kid", "budget-app" }
                }
            };
            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }

        private static ClaimsIdentity GenerateClaims(AspNetUser user)
        {
            var ci = new ClaimsIdentity();
            ci.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
            ci.AddClaim(new Claim(ClaimTypes.Name, user.UserName!));
            return ci;
        }
    }
}