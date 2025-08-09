import React, { useEffect, useState } from "react";
import api from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryIds: [],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    api
      .get(`/product/paged?page=${page}&pageSize=${pageSize}&search=${search}`)
      .then((res) => {
        setProducts(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error("Fetch products failed", err))
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    api
      .get("/productcategory")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Fetch categories failed", err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selected) => {
    setFormData({
      ...formData,
      categoryIds: selected.map((option) => option.value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
    };
    const method = isEdit
      ? api.put(`/product/${editId}`, payload)
      : api.post("/product", payload);

    method.then(() => {
      fetchProducts();
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryIds: [],
      });
      setIsEdit(false);
    });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryIds: product.categories?.map((c) => c.id) || [],
    });
    setIsEdit(true);
    setEditId(product.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      api.delete(`/product/${id}`).then(fetchProducts);
    }
  };

  return (
    <div className="container mt-5">
      {/* Form Section */}
      <div className="card shadow p-4 mb-4">
        <h2 className="text-center text-primary mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              placeholder="Stock Quantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <Select
              isMulti
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              value={categories
                .filter((c) => formData.categoryIds.includes(c.id))
                .map((c) => ({ value: c.id, label: c.name }))}
              onChange={handleCategoryChange}
              placeholder="Select Categories..."
            />
          </div>
          <div className="col-12 d-grid">
            <button
              type="submit"
              className={`btn ${isEdit ? "btn-warning" : "btn-success"}`}
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="card shadow p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-primary m-0">Product List</h3>
          <input
            type="text"
            className="form-control w-auto"
            style={{ minWidth: "250px" }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {loading ? (
          <div className="text-center my-4">
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-secondary">Fetching products...</p>
          </div>
        ) : (
          <>
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Categories</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.description}</td>
                      <td>{p.price}</td>
                      <td>{p.stockQuantity}</td>
                      <td>{p.categories?.map((c) => c.name).join(", ")}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${page === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
