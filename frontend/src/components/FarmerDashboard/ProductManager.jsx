import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext"; //   Import AuthContext
import classes from "./ProductManager.module.css";

const ProductManager = () => {
  const { user } = useContext(AuthContext); //   Get authenticated user
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    unitprice: "",
    farmer_id: user?.id || "", //   Directly use user ID
    category_id: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/products?farmer_id=${user.id}`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));

    axios
      .get("http://localhost:8081/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [user]); //   Runs when `user` changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:8081/api/products/${editingId}`
      : "http://localhost:8081/api/products";
    const method = editingId ? "put" : "post";

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    axios({
      method: method,
      url: url,
      data: formDataToSend,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        setEditingId(null);
        refreshProducts();
        resetForm();
      })
      .catch((error) => console.error("Error saving product:", error));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quantity: "",
      unitprice: "",
      farmer_id: user.id || "",
      category_id: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8081/api/products/${id}`)
      .then(() => refreshProducts())
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      category_id: product.category_id ? product.category_id.toString() : "",
    });
    setEditingId(product.id);
    setImagePreview(product.image);
  };

  const refreshProducts = () => {
    axios
      .get(`http://localhost:8081/api/products?farmer_id=${user.id}`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  return (
    <div className={classes.dashboardContainer}>
      <h2>Manage Products</h2>

      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <label className={classes.fileUpload}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <span>Upload Product Image</span>
        </label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className={classes.previewImage}
          />
        )}

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          type="number"
          name="unitprice"
          value={formData.unitprice}
          onChange={handleChange}
          placeholder="Unit Price"
          required
        />
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className={classes.productList}>
        {products.map((product) => (
          <div key={product.id} className={classes.productCard}>
            <img src={product.image} alt={product.name} width="150" />
            <h3>{product.name}</h3>
            <p>
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p>
              <strong>Price:</strong> ₹{product.unitprice}
            </p>
            <div className={classes.buttonGroup}>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
