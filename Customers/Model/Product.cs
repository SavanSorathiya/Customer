using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Customers.Model
{
    public class Product
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Product name should be required.")]
        public string Name { get; set; } = null;
        public string Description { get; set; } = null;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public ICollection<ProductCategoryMap> CategoryMappings { get; set; } = new List<ProductCategoryMap>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        [NotMapped]
        public List<int> categoryIds { get; set; }
    }
}
