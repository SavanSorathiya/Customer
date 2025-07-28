using Backend.Data;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Collections.Specialized;
using System.Net;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Customer : Controller
    {
       private readonly AppDbContext _context;
        public Customer(AppDbContext context)
        {
            _context = context;
        }

        //Find the latest order for each customer based in order dateTime.
        [HttpGet("latest-orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetLatestOrders()
        {
            try
            {
                var latestOrders = await _context.Orders
                    .GroupBy(o => o.CustomerId)
                    .Select(g => g.OrderByDescending(o => o.OrderDate).FirstOrDefault())
                    .Where(o => o != null)
                    .ToListAsync();

                return Ok(latestOrders);
            }
            catch (Exception)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving latest orders from the database");
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Model.Customer>>> GetCustomers()
        {
            try
            {
                return await _context.Customers.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving data from the database");
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Model.Customer>> GetCustomer(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    return NotFound($"Customer with ID {id} not found");
                }
                return customer;
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving data from the database");
            }
        }
    }
}
