using System.Security.Claims;
using Budget.DB;
using Budget.DB.Models;
using Budget.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budget.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class BankController : ControllerBase
    {
        private readonly BudgetDBContext _context;
        private readonly ILogger<BankController> _logger;

        public BankController(BudgetDBContext context, ILogger<BankController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            var accounts = await _context.Accounts
            .Include(e => e.Currency)
            .ToListAsync();

            if (accounts == null || accounts.Count == 0)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "No accounts found",
                        message = "No accounts found"
                    }
                );
            }
            return Ok(
                new
                {
                    status = 200,
                    title = "Accounts found",
                    message = new
                    {
                        banks = accounts
                    }
                }
            );
        }

        [HttpPost]
        public async Task<IActionResult> AddAccount([FromBody] BankModel model)
        {
            _logger.LogInformation("=====Type: " + model.Type.ToString());
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(
                    new
                    {
                        status = 401,
                        title = "User not authenticated",
                        message = "Please login to access"
                    }
                );
            }

            var currency = await _context.Currencies.FindAsync(model.CurrencyId);
            var user = await _context.AspNetUsers.FindAsync(userId);

            if (currency == null)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "Creating account failed",
                        message = "Given currency not found"
                    }
                );
            }

            if (user == null)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "Creating account failed",
                        message = "Given user not found"
                    }
                );
            }

            var account = new Account
            {
                CreateTime = DateTime.UtcNow,
                Name = model.Name,
                Type = model.Type.ToString(),
                Balance = model.InitialBalance,
                Description = model.Description,
                CurrencyId = model.CurrencyId,
                Currency = currency,
                UserId = userId
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    status = 200,
                    title = "Account added",
                    message = new
                    {
                        account = account
                    }
                }
            );
        }
    }
}