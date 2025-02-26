using Microsoft.EntityFrameworkCore;
using Budget.DB.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Budget.DB
{
    public class BudgetDBContext : IdentityDbContext<AspNetUser>
    {
        public BudgetDBContext(DbContextOptions<BudgetDBContext> options)
                : base(options) { }
    }
}