using System.Security.Claims;
using Budget.DB;
using Budget.DB.Models;
using Budget.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budget.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly BudgetDBContext _context;
        private readonly ILogger<CurrencyController> _logger;

        public CurrencyController(BudgetDBContext context, ILogger<CurrencyController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrencies()
        {
            var currencies = await _context.Currencies.ToListAsync();

            if (currencies == null || currencies.Count == 0)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "No currencies found",
                        message = "No currencies found"
                    }
                );
            }

            return Ok(
            new
            {
                status = 200,
                title = "Currencies found",
                message =
                new
                {
                    currencies = currencies
                }
            }
            );
        }

        [HttpPost]
        public async Task<IActionResult> AddCurrency([FromBody] CurrencyModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(
                    new
                    {
                        status = 401,
                        title = "User not authenticated",
                        message = "User not authenticated"
                    }
                );
            }

            var currency = new Currency
            {
                Name = model.Name,
                Symbol = model.Symbol,
            };

            var duplicateCurrency = await _context.Currencies
                .Where(c => c.Name == currency.Name || c.Symbol == currency.Symbol)
                .FirstOrDefaultAsync();

            if (duplicateCurrency != null)
            {
                return BadRequest(
                    new
                    {
                        status = 400,
                        title = "Currency already exists",
                        message = "Currency already exists"
                    }
                );
            }

            _context.Currencies.Add(currency);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    status = 200,
                    title = "Currency added",
                    message = new
                    {
                        currency = currency
                    }
                }
            );
        }
    }
}