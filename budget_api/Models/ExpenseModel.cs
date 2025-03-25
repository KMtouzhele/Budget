using System.ComponentModel.DataAnnotations;

namespace Budget.Models
{
    public class ExpenseModel
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Category { get; set; }
        public string? Description { get; set; }
        [Required]
        public required decimal Amount { get; set; }
        [Required]
        public required int AccountId { get; set; }

        [Required]
        public required DateTime Date { get; set; }
    }
}