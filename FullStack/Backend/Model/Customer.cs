using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Customer name is required")]
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        public IEnumerable<Order> Orders { get; set; } = new List<Order>();
    }
}
