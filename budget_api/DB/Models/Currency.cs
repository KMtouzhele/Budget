using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Budget.DB.Models
{
    public class Currency
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("Name")]
        [StringLength(3)]
        public required string Name { get; set; }

        [Column("Symbol")]
        [StringLength(3)]
        public required string Symbol { get; set; }
    }
}