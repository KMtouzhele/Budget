using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Budget.DB.Models
{
    public class Expense
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("CreateTime")]
        public DateTime CreateTime { get; set; }

        [Column("Category")]
        [EnumDataType(typeof(ExpenseCategory))]
        public string Category { get; set; } = ExpenseCategory.Other.ToString();

        [Column("Name")]
        [StringLength(255)]
        public string Name { get; set; } = "";

        [Column("Amount")]
        [Precision(10, 2)]
        public decimal Amount { get; set; }

        [Column("Currency")]
        [StringLength(3)]
        public string Currency { get; set; } = "AUD";

        [Column("Description")]
        public string? Description { get; set; }

        [Column("Date")]
        public DateTime Date { get; set; }

        [Column("UserId")]
        public required string UserId { get; set; }
    }
}