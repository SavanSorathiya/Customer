using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        [Required(ErrorMessage = "Quantity is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative")]
        public decimal Quantity { get; set; } = 0m;
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}
