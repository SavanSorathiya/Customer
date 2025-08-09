import React, { useEffect, useState } from "react";
import api from "./api";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api
      .get("/productcategory")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Fetch categories failed", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEdit
      ? api.put(`/productcategory/${editId}`, formData)
      : api.post("/productcategory", formData);

    method.then(() => {
      fetchCategories();
      setFormData({ name: "" });
      setIsEdit(false);
    });
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setIsEdit(true);
    setEditId(category.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      api.delete(`/productcategory/${id}`).then(fetchCategories);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center text-primary">
          {isEdit ? "Edit Category" : "Add Category"}
        </h2>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 d-grid">
            <button
              type="submit"
              className={`btn ${isEdit ? "btn-warning" : "btn-success"}`}
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* Table Section */}
        {loading ? (
          <p className="text-center text-secondary">Loading categories...</p>
        ) : (
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Category Name</th>
                <th style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryPage;
