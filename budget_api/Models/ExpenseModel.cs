using System.ComponentModel.DataAnnotations;

namespace Budget.Models
{
    public class ExpenseModel
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Category { get; set; }
        [Required]
        public required string Description { get; set; }
        [Required]
        public required decimal Amount { get; set; }
        [Required]
        public required string Currency { get; set; }
    }
}