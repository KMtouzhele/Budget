using Microsoft.EntityFrameworkCore;
using Budget.DB.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Budget.DB
{
    public class BudgetDBContext : IdentityDbContext<AspNetUser>
    {
        public BudgetDBContext(DbContextOptions<BudgetDBContext> options)
                : base(options) { }

        public DbSet<Expense> Expenses { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Expense>()
                .HasOne<AspNetUser>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<Expense>()
                .Property(e => e.Category)
                .HasConversion<string>();

        }
    }
}