using System.ComponentModel.DataAnnotations;

namespace Customers.Model
{
    public class ProductCategory
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Product-category name should be required.")]
        public string Name { get; set; } = null;

        public ICollection<ProductCategoryMap> ProductMappings { get; set; } = new List<ProductCategoryMap>();
    }
}
