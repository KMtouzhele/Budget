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
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Expense>()
            .HasOne<Account>()
            .WithMany()
            .HasForeignKey(e => e.AccountId);

            modelBuilder.Entity<Expense>()
            .Property(e => e.Category)
            .HasConversion<string>();

            modelBuilder.Entity<Account>()
            .HasOne<AspNetUser>()
            .WithMany()
            .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<Account>()
            .HasOne<Currency>()
            .WithMany()
            .HasForeignKey(e => e.CurrencyId);

            modelBuilder.Entity<Expense>()
            .Property(e => e.Type)
            .HasConversion<string>();
        }
    }
}