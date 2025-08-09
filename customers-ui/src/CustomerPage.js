import React, { useEffect, useState } from "react";
import api from "./api";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // ✅ Added phone field
    productId: "",
    orderValue: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCustomers = () => {
    api
      .get("/customer")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Fetch customers failed", err));
  };

  const fetchProducts = () => {
    api
      .get("/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Fetch products failed", err));
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customerOrder = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone, // ✅ Send phone to API
      productId: parseInt(formData.productId),
      orderValue: parseFloat(formData.orderValue),
    };

    const method = isEdit
      ? api.put(`/customer/${editId}`, customerOrder)
      : api.post("/customer", customerOrder);

    method.then(() => {
      fetchCustomers();
      setFormData({
        name: "",
        email: "",
        phone: "",
        productId: "",
        orderValue: "",
      });
      setIsEdit(false);
    });
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "", // ✅ Populate phone in edit mode
      productId: customer.productId,
      orderValue: customer.orderValue,
    });
    setIsEdit(true);
    setEditId(customer.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      api.delete(`/customer/${id}`).then(fetchCustomers);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">
        {isEdit ? "Edit Customer Order" : "Add Customer Order"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="row g-3 bg-light p-4 rounded shadow-sm"
      >
        {/* Name */}
        <div className="col-md-6">
          <label className="form-label">Customer Name</label>
          <input
            name="name"
            className="form-control"
            placeholder="Enter customer name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="form-label">
            Phone 
          </label>
          <input
            name="phone"
            type="tel"
            className="form-control"
            placeholder="Enter mobile number"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
          />
        </div>

        {/* Product */}
        <div className="col-md-6">
          <label className="form-label">Product</label>
          <select
            name="productId"
            className="form-select"
            value={formData.productId}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Value */}
        <div className="col-md-4">
          <label className="form-label">Order Value</label>
          <input
            name="orderValue"
            type="number"
            className="form-control"
            placeholder="Enter order value"
            value={formData.orderValue}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <div className="col-md-4 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th> {/* ✅ Added phone column */}
              <th>Product</th>
              <th>Order Value</th>
              <th>Order Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td> {/* ✅ Display phone */}
                <td>
                  {products.find((p) => p.id === c.productId)?.name || "N/A"}
                </td>
                <td>{c.orderValue}</td>
                <td>{new Date(c.orderTime).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(c)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;
