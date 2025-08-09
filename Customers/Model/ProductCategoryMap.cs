namespace Customers.Model
{
    public class ProductCategoryMap
    {
        public int ProductId { get; set; }
        public Product Product { get; set; } = null;

        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; } = null;
    }
}
