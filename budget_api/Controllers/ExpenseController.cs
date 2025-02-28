using Budget.DB;
using Budget.DB.Models;
using Budget.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Budget.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly BudgetDBContext _context;
        private readonly ILogger<ExpenseController> _logger;

        public ExpenseController(BudgetDBContext context, ILogger<ExpenseController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            _logger.LogInformation("Getting expenses for user");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }
            _logger.LogInformation("UserID found: {UserId}", userId);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.CreateTime)
                .ToListAsync();

            if (expenses == null || expenses.Count == 0)
            {
                return NotFound(
                    new
                    {
                        message = "No expenses found for user"
                    }
                );
            }

            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] ExpenseModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            Expense expense = new()
            {
                Name = model.Name,
                Category = model.Category,
                Description = model.Description,
                Amount = model.Amount,
                Currency = model.Currency,
                UserId = userId,
                CreateTime = DateTime.UtcNow
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    message = "Expense created successfully",
                    expense = expense
                }
            );
        }
    }
}