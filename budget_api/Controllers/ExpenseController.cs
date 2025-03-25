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
        public async Task<IActionResult> GetExpenses()
        {
            _logger.LogInformation("Getting expenses for user");
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
            _logger.LogInformation("UserID found: {UserId}", userId);

            var expenses = await _context.Expenses
            .Include(e => e.Account)
            .Where(e => e.Account.UserId == userId)
            .OrderByDescending(e => e.CreateTime)
            .ToListAsync();

            if (expenses == null || expenses.Count == 0)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "No expenses found for user",
                        message = "No expenses found for user"
                    }
                );
            }
            return Ok(
                new
                {
                    status = 200,
                    title = "Expenses found",
                    message =
                    new
                    {
                        expenses = expenses
                    }
                }
            );
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] ExpenseModel model)
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
            if (!Enum.TryParse<ExpenseCategory>(model.Category, true, out var expenseCategory) ||
            !Enum.IsDefined(expenseCategory))
            {
                return BadRequest(
                new
                {
                    status = 400,
                    title = "Invalid expense category",
                    message = "Needed to be one of: Food, Rent, Bills, Transport, Other"
                }
                );
            }
            var account = await _context.Accounts.FindAsync(model.AccountId);
            if (account == null)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "Account not found",
                        message = "Account not found"
                    }
                );
            }

            Expense expense = new()
            {
                Name = model.Name,
                Category = model.Category,
                Description = model.Description,
                Amount = model.Amount,
                AccountId = model.AccountId,
                Account = account,
                Date = model.Date,
                CreateTime = DateTime.UtcNow
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    status = 200,
                    title = "Expense created successfully",
                    message = new
                    {
                        expense = expense
                    },
                }
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, ExpenseModel model)
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

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "Expense not found",
                        message = "Expense not found"
                    }
                );
            }

            if (expense.Account.UserId != userId)
            {
                return Unauthorized(
                    new
                    {
                        status = 401,
                        title = "User not authorized",
                        message = "User not authorized to update this expense"
                    }
                );
            }

            if (!Enum.TryParse<ExpenseCategory>(model.Category, true, out var expenseCategory) ||
            !Enum.IsDefined(expenseCategory))
            {
                return BadRequest(
                new
                {
                    status = 400,
                    title = "Invalid expense category",
                    message = "Needed to be one of: Food, Rent, Bills, Transport, Other"
                }
                );
            }

            expense.Name = model.Name;
            expense.Category = model.Category;
            expense.Description = model.Description;
            expense.Amount = model.Amount;
            expense.AccountId = model.AccountId;
            expense.Date = model.Date;

            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    status = 200,
                    title = "Expense updated successfully",
                    message = new
                    {
                        expense = expense
                    },
                }
            );
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
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

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound(
                    new
                    {
                        status = 404,
                        title = "Expense not found",
                        message = "Expense not found"
                    }
                );
            }

            if (expense.Account.UserId != userId)
            {
                return Unauthorized(
                    new
                    {
                        status = 401,
                        title = "User not authorized",
                        message = "User not authorized to delete this expense"
                    }
                );
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    status = 200,
                    title = "Expense deleted successfully",
                    message = "Expense deleted successfully"
                }
            );
        }
    }
}