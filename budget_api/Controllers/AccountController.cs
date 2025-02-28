using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Budget.DB.Models;
using Budget.Models;
using Budget.Services;

namespace Budget.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly SignInManager<AspNetUser> _signInManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;

        public AccountController(
            UserManager<AspNetUser> userManager,
            SignInManager<AspNetUser> signInManager,
            ILogger<AccountController> logger,
            IConfiguration configuration,
            AuthService authService
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _configuration = configuration;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                _logger.LogError("Passwords do not match.");
                return BadRequest(new { message = "Passwords do not match" });
            }
            var user = new AspNetUser { UserName = model.UserName };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                _logger.LogInformation("User registered successfully.");
                return Ok(new { message = "User registered successfully" });
            }

            _logger.LogError("User registration failed.");
            return BadRequest(new { message = "User registration failed", errors = result.Errors });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                var token = _authService.GenerateJwtToken(user!);
                _logger.LogInformation("User logged in successfully.");
                return Ok(new { token });
            }

            _logger.LogWarning("Invalid login attempt.");
            return Unauthorized(new { message = "Invalid login attempt" });
        }
    }
}