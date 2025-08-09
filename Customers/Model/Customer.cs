using System.ComponentModel.DataAnnotations;

namespace Customers.Model
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        [Required (ErrorMessage ="Customer name should be required.")]
        public string Name { get; set; } = null;
        public string Email { get; set; } = null;
        public string Phone { get; set; } = null;

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
