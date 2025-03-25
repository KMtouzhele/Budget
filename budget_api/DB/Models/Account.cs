using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Budget.DB.Models
{
    public class Account
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("CreateTime")]
        public DateTime CreateTime { get; set; }

        [Column("Name")]
        [StringLength(255)]
        public string Name { get; set; } = "";

        [Column("Type")]
        [EnumDataType(typeof(AccountType))]
        public string Type { get; set; } = AccountType.Other.ToString();

        [Column("InitialBalance")]
        [Precision(10, 2)]
        public decimal Balance { get; set; }

        [Column("Description")]
        public string? Description { get; set; }

        [Column("UserId")]
        public required string UserId { get; set; }

        [Column("CurrencyId")]
        public required int CurrencyId { get; set; }

        [ForeignKey("CurrencyId")]
        public required Currency Currency { get; set; }
    }

    public enum AccountType
    {
        Bank,
        Cash,
        Aplipay,
        WeChatPay,
        CreditCard,
        Other
    }
}