using Customers.Model;
using Microsoft.EntityFrameworkCore;

namespace Customers.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {

        }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductCategoryMap> ProductCategoryMaps { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductCategoryMap>()
                .HasKey(pc => new { pc.ProductId, pc.ProductCategoryId });

            modelBuilder.Entity<ProductCategoryMap>()
                .HasOne(pc => pc.Product)
                .WithMany(p => p.CategoryMappings)
                .HasForeignKey(pc => pc.ProductId);

            modelBuilder.Entity<ProductCategoryMap>()
                .HasOne(pc => pc.ProductCategory)
                .WithMany(c => c.ProductMappings)
                .HasForeignKey(pc => pc.ProductCategoryId);
        }
    }
}
