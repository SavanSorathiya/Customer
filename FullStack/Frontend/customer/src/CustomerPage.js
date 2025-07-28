import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    product: '',
    quantity: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // API base URL (replace with your .NET Core API endpoint)
  const API_URL = 'https://your-api-url.com/api/customers';

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(API_URL);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Create or Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchCustomers();
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setFormData(customer);
    setIsEditing(true);
  };

  // Delete customer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      product: '',
      quantity: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <h2>Customer Management</h2>
      
      {/* Customer Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">product</label>
          <input
            type="dropdown"
            className="form-control"
            name="product"
            value={formData.product}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Customers Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.product}</td>
              <td>{customer.quantity}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(customer)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerPage;