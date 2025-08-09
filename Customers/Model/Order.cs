using System.ComponentModel.DataAnnotations;

namespace Customers.Model
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }

        public Customer Customer { get; set; } = null;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
