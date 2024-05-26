import React, { useState, useEffect ,useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import the useAuth hook

const Upload = () => {
  const { user, isLoggedIn } = useAuth(); // Access user details and login status from AuthContext
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
   
   const generateProductID = () => {
    return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
  };
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    area: "",
    price: "",
    city: "",
    state: "",
    dimension: "",
    description: "",
    likes: 0,
    createdByUserID: user?.userDetails?.userID || "", // Set createdByUserID to current user's ID if available
    productID: generateProductID(),
  });

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetNewProduct(); // Reset newProduct state
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      type: "",
      area: "",
      price: "",
      city: "",
      state: "",
      dimension: "",
      description: "",
      likes: 0,
      createdByUserID: user?.userDetails?.userID || "",
      productID: generateProductID(),
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value,
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleAddProduct = async () => {
    try {
      if (!isLoggedIn) {
        alert("You need to log in to upload a product.");
        return;
      }
      if (user?.userDetails?.userType !== "seller") {
        alert("You need to be a seller to upload or edit the product.");
        return;
      }
      const response = await axios.post(
        "http://localhost:4000/addProduct",
        newProduct
      );
      console.log("Product added:", response.data);
      fetchProducts(); // Automatically fetch products after adding
      handleCloseModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    
  }, []); 

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditProduct = (product) => {
    setEditingProduct(product); // Set the product being edited
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      // Send request to update product
      const response = await axios.post(
        "http://localhost:4000/updateProduct",
        editingProduct
      );
      console.log("Product updated:", response.data);
      fetchProducts(); // Fetch products after updating
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productID) => {
    try {
      await axios.post("http://localhost:4000/deleteProduct", { productID });
      console.log("Product deleted");
      fetchProducts(); // Automatically fetch products after deleting
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!isLoggedIn) {
    return <div><h1>You need to log in to upload products.</h1></div>;
  }


  return (
    <div className="container mx-auto p-4">
      {/* Modal for adding a new product */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={newProduct.type}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Type</option>
                  <option value="Office">Office</option>
                  <option value="House">House</option>
                  <option value="Land">Land</option>
                  {/* Add other options as needed */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={newProduct.area}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={newProduct.city}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={newProduct.state}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Dimension
                </label>
                <input
                  type="text"
                  name="dimension"
                  value={newProduct.dimension}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md w-full md:w-1/2">
            {/* Edit Product form */}
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form>
              {/* Input fields for editing the product */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={editingProduct.type}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Type</option>
                  <option value="Office">Office</option>
                  <option value="House">House</option>
                  <option value="Land">Land</option>
                  {/* Add other options as needed */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={editingProduct.area}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editingProduct.city}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={editingProduct.state}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Dimension
                </label>
                <input
                  type="text"
                  name="dimension"
                  value={editingProduct.dimension}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProduct}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Product Actions</h1>

      {user.userDetails.userType === "seller" && (
        <div className="mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add Product
          </button>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="p-4 bg-white rounded shadow-md">
              <p className="text-lg font-medium">{product.name}</p>
              <p>Type: {product.type}</p>
              <p>Area: {product.area}</p>
              <p>Price: {product.price}</p>
              <p>City: {product.city}</p>
              <p>State: {product.state}</p>
              <p>Dimension: {product.dimension}</p>
              <p>Description: {product.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.productID)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload;
