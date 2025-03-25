using System.ComponentModel.DataAnnotations;

namespace Budget.Models
{
    public class CurrencyModel
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Symbol { get; set; }
    }
}