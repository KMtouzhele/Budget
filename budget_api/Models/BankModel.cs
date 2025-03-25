
using System.ComponentModel.DataAnnotations;
using Budget.DB.Models;

namespace Budget.Models 
{
    public class BankModel
    {

        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Type { get; set; }
        [Required]
        public required decimal InitialBalance { get; set; }
        public string? Description { get; set; }
        [Required]
        public required int CurrencyId { get; set; }
    }
}