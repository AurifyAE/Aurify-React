import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Textarea,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,

} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MdAddShoppingCart } from "react-icons/md";
import axiosInstance from "../../axios/axiosInstance";
import { IconButton } from '@mui/material';

const ProductTag = {
  BEST_SELLER: 'Best Seller',
  SEASONAL: 'Seasonal',
  NEW_ARRIVAL: 'New Arrival',
  TOP_RATED: 'Top Rated',
  EXCLUSIVE: 'Exclusive',
  BACK_IN_STOCK: 'Back in Stock',
  NONE: 'None',
};

const Shop = () => {

  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // maincategory
  const [isMainCategoryModalOpen, setIsMainCategoryModalOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const [mainCategoryformData, setMainCategoryFormData] = useState({
    image: null,
    name: "",
    description: "",
    imagePreview: null,
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    image: null,
    imagePreview: null,
  });

  // subcategory
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    description: "",
    mainCategoryId: "",
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isViewAllSubOpen, setIsViewAllSubOpen] = useState(false);

  // product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    weight: '',
    purity: '',
    type: '',
    tags: 'New Arrival',
    sku: '',
    subCategory: '',
    image: [],
  });
  const [products, setProducts] = useState([]);
  const [isViewAllProductOpen, setIsViewAllProductOpen] = useState(false);
  const [commodities, setCommodities] = useState([]);


  const toggleViewAll = () => setIsViewAllOpen(!isViewAllOpen);
  const toogleSubViewAll = () => setIsViewAllSubOpen(!isViewAllSubOpen);
  const toogleProductViewAll = () => setIsViewAllProductOpen(!isViewAllProductOpen);


  // filter
  const [filterSubCategories, setFilterSubCategories] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [subCategoryProducts, setSubCategoryProducts] = useState([]);

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // editing
  const [editingMainCategory, setEditingMainCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchSubCategories();
      await fetchProducts();
      await fetchCommodities();
    };
    fetchData();
  }, []);
  const onClose = () => {
    setIsMainCategoryModalOpen(false); // For main category modal
    setIsSubCategoryModalOpen(false); // For subcategory modal
  };

  // Function to fetch commodities
  const fetchCommodities = async (userName) => {

    try {
      const userName = localStorage.getItem("userName");
      if (!userName) {
        toast.error("Username is required to fetch commodities.");
        return;
      }

      const response = await axiosInstance.get(`/commodities/${userName}`);
      if (response.data && response.data.success) {
        const commodityData = response.data.data.commodities;
        setCommodities(commodityData); // Update state with fetched commodities
      } else {
        throw new Error("Failed to fetch commodities.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching commodities.";
      toast.error(errorMessage);
      console.error("Error fetching commodities:", error);
    }
  };



  // filter

  const handleMainCategoryClick = async (mainCategory) => {
    try {
      setSelectedMainCategory(mainCategory);
      const response = await axiosInstance.get(`/sub-categories/${mainCategory._id}`);
      console.log("Fetched subcategories:", response.data); // Debug
      setFilterSubCategories(response.data.data || []); // Update state with fetched subcategories
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Error loading subcategories");
    }
  };

  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products for a selected subcategory
  const fetchByProducts = async (subCategory) => {
    try {
      setSelectedSubCategory(subCategory); // Update selected subcategory
      setLoading(true); // Start loading
      setError(""); // Clear previous errors

      const response = await axiosInstance.get(`/get-product?subCateId=${subCategory._id}`);
      console.log("Fetched products:", response.data); // Debugging

      if (response.data.success) {
        setFilteredProducts(response.data.data.result || []); // Update state with fetched products
      } else {
        setFilteredProducts([]); // No products found
        toast.info("No products available for this subcategory");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error loading products"); // Show error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle subcategory click
  const handleSubCategoryClick = (subCategory) => {
    fetchByProducts(subCategory); // Fetch products for the selected subcategory
  };




  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/main-categories');
      setMainCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      toast.error('Error loading categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/sub-categories');
      setSubCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch subcategories');
      toast.error('Error loading subcategories');
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMainCategoryFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };

  const handleSubCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMainCategoryFormData((prevData) => ({
      ...prevData,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : "",
    }));
  };


  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/main-category/${categoryId}`);
      await fetchCategories();

      // Remove subcategories associated with this category
      const updatedSubCategories = subCategories.filter(
        subCat => subCat.mainCategory !== categoryId
      );
      setSubCategories(updatedSubCategories);


      toast.success('Category  deleted successfully!');
    } catch (error) {
      toast.error('Error deleting category');
      console.error('Error:', error);
    }
  };


  const [isEditMode, setIsEditMode] = useState(false);

  //  AddMainCategory function
  const handleAddMainCategory = async () => {
    const formData = new FormData();
    formData.append("image", mainCategoryformData.image);
    formData.append("name", mainCategoryformData.name);
    formData.append("description", mainCategoryformData.description);

    try {
      const response = await axiosInstance.post("/main-category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Main Category Added:", response.data);

      toast.success("Main Category added successfully!");

      // Reset form and close modal
      setMainCategoryFormData({
        image: null,
        name: "",
        description: "",
        imagePreview: null,
      });
      setIsViewAllOpen(false);
      setIsEditMode(false);

      // Refresh categories
      await fetchCategories();
    } catch (error) {
      console.error("Error adding main category:", error);
      toast.error("Failed to add Main Category. Please try again.");
    }
  };

  // maincategory edit function
  const handleEditCategory = (category) => {
    setIsEditMode(true);
    setEditingMainCategory(category);
    setMainCategoryFormData({
      name: category.name,
      description: category.description || '',
      image: null,
      imagePreview: category.image
    });
    setIsViewAllOpen(true);
  };



  // Create a new function for updating a category
  const handleUpdateCategory = async () => {
    const formData = new FormData();
    formData.append("name", mainCategoryformData.name);
    formData.append("description", mainCategoryformData.description);

    // Only append image if a new image is selected
    if (mainCategoryformData.image) {
      formData.append("image", mainCategoryformData.image);
    }

    try {
      const response = await axiosInstance.put(`/main-category/${editingMainCategory._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category updated successfully!");

      // Reset states
      setMainCategoryFormData({
        image: null,
        name: "",
        description: "",
        imagePreview: null,
      });
      setIsViewAllOpen(false);
      setIsEditMode(false);
      setEditingMainCategory(null);

      // Refresh categories
      await fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  const handleAddSubCategory = async () => {
    try {
      const response = await axiosInstance.post("/sub-category", subCategoryForm); // Replace with your endpoint
      toast.success("Subcategory added successfully!");
      setSubCategoryForm({
        name: "",
        description: "",
        mainCategoryId: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Failed to add subcategory. Please try again.");
    }
  };

  // Fetch Products Method
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/get-allproduct`);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Error loading products');
      console.error('Error fetching products:', error);
    }
  };

 


  const handleDeleteSubCategory = async (subCategoryId) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this sub-category? ')) {
      return;
    }
    try {
      // Delete from backend
      await axiosInstance.delete(`/sub-category/${subCategoryId}`);

      // Remove from local state
      setSubCategories(prevSubCategories =>
        prevSubCategories.filter(subCat => subCat._id !== subCategoryId)
      );


      toast.success('Sub-Category and associated products deleted successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting sub-category';
      toast.error(errorMessage);
      console.error('Delete Sub-Category Error:', error);
    }
  };


  // product section

  // new code
  // const handleAddProduct = async () => {
  //   try {
  //     // Validation
  //     if (!productForm.title || !productForm.price || !productForm.sku || !productForm.subCategory) {
  //       toast.error('Please fill in all required fields: Title, Price, SKU, and Subcategory.');
  //       return;
  //     }

  //     // Prepare form data
  //     const formData = new FormData();
  //     formData.append('title', productForm.title);
  //     formData.append('description', productForm.description);
  //     formData.append('price', Number(productForm.price));
  //     formData.append('weight', Number(productForm.weight));
  //     formData.append('purity', Number(productForm.purity));
  //     formData.append('type', productForm.type);
  //     formData.append('tags', productForm.tags);
  //     formData.append('sku', productForm.sku);
  //     formData.append('subCategory', productForm.subCategory);

  //     // Handle image uploads
  //     if (productForm.image) {
  //       if (Array.isArray(productForm.image)) {
  //         productForm.image.forEach((img) => formData.append('image', img));
  //       } else {
  //         formData.append('image', productForm.image);
  //       }
  //     }

  //     // Define `adminId` or `userId`
  //     const adminId = '6750225790f570ea51d41d61'; // Replace with actual admin ID logic (e.g., from Redux, Context, or localStorage)
  //     const userId = null; // Or fetch the userId if applicable

  //     // Construct the URL with query parameters
  //     const url = `/products${adminId ? `?adminId=${adminId}` : userId ? `?userId=${userId}` : ''}`;

  //     // Make the API request
  //     const response = await axiosInstance.post(url, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     console.log('Product added:', response.data);

  //     // Close the modal and reset the form
  //     setIsViewAllProductOpen(false);
  //     setProductForm({
  //       title: '',
  //       description: '',
  //       price: '',
  //       weight: '',
  //       purity: '',
  //       type: '',
  //       tags: 'New Arrival',
  //       sku: '',
  //       subCategory: '',
  //       image: null,
  //     });

  //     toast.success('Product added successfully!');
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || 'Failed to add product.';
  //     toast.error(errorMessage);
  //     console.error('Error adding product:', error.response || error);
  //   }
  // };

  const handleAddProduct = async () => {
    try {
      // Validation
      if (!productForm.title || !productForm.price || !productForm.sku || !productForm.subCategory) {
        toast.error('Please fill in all required fields: Title, Price, SKU, and Subcategory.');
        return;
      }

      // Retrieve user from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      // Determine adminId or userId
      const adminId = user?._id || null;
      const userId = null; // Modify this if you want to use userId in some cases

      // Prepare form data
      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('description', productForm.description);
      formData.append('price', Number(productForm.price));
      formData.append('weight', Number(productForm.weight));
      formData.append('purity', Number(productForm.purity));
      formData.append('type', productForm.type);
      formData.append('tags', productForm.tags);
      formData.append('sku', productForm.sku);
      formData.append('subCategory', productForm.subCategory);

      // Handle image uploads
      if (productForm.image) {
        if (Array.isArray(productForm.image)) {
          productForm.image.forEach((img) => formData.append('image', img));
        } else {
          formData.append('image', productForm.image);
        }
      }

      // Construct the URL with query parameters
      const url = `/products${adminId ? `?adminId=${adminId}` : userId ? `?userId=${userId}` : ''}`;

      // Make the API request
      const response = await axiosInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Product added:', response.data);

      // Close the modal and reset the form
      setIsViewAllProductOpen(false);
      setProductForm({
        title: '',
        description: '',
        price: '',
        weight: '',
        purity: '',
        type: '',
        tags: 'New Arrival',
        sku: '',
        subCategory: '',
        image: null,
      });

      toast.success('Product added successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add product.';
      toast.error(errorMessage);
      console.error('Error adding product:', error.response || error);
    }
  };
  // -------------------------------
  const handleEditSubCategory = (subCategory) => {
    setIsEditMode(true); // Set edit mode to true
    setEditingSubCategory(subCategory); // Store the selected subcategory for editing
    setSubCategoryForm({
      name: subCategory.name,
      description: subCategory.description || '',
      mainCategoryId: subCategory.mainCategory._id || '', // Assuming mainCategory is an object
    });
    setIsViewAllSubOpen(true); // Open the modal for editing
  };

  const handleUpdateSubCategory = async () => {
    const formData = new FormData();
    formData.append("name", subCategoryForm.name);
    formData.append("description", subCategoryForm.description);

    // Only append image if a new image is selected
    if (subCategoryForm.image) {
      formData.append("image", subCategoryForm.image);
    }

    try {
      const response = await axiosInstance.put(`/sub-category/${editingSubCategory._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Subcategory updated successfully!");

      // Reset form and state after successful update
      setSubCategoryForm({
        name: "",
        description: "",
        mainCategoryId: "",
        image: null,
        imagePreview: null,
      });
      setIsSubCategoryModalOpen(false); // Close the modal
      setIsEditMode(false); // Exit edit mode
      setEditingSubCategory(null); // Clear the editing subcategory

      // Refresh subcategories
      await fetchSubCategories();
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("Failed to update subcategory. Please try again.");
    }
  };
// ------------------------

    const handleEditProduct = (product) => {
      setIsEditMode(true); // Enable edit mode
      setEditingProduct(product); 
      setProductForm({
          title: product.title,
          description: product.description || '',
          price: product.price?.toString() || '',
          weight: product.weight?.toString() || '',
          type: product.type || '',
          purity: product.purity?.toString() || '',
          tags: product.tag || 'New Arrival',
          sku: product.sku,
          subCategory: product.subCategory.toString(),
          image: [], 
      });
      setIsViewAllProductOpen(true);
  };
  const handleUpdateProduct = async () => {
    try {
      // Form validation
      if (!productForm.title || !productForm.price || !productForm.sku || !productForm.subCategory) {
        toast.error("Please fill in all required fields: Title, Price, SKU, and Subcategory.");
        return;
      }
  
      // Prepare form data
      const formData = new FormData();
      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("price", Number(productForm.price)); // Convert to number
      formData.append("weight", Number(productForm.weight)); // Convert to number
      formData.append("purity", Number(productForm.purity)); // Convert to number
      formData.append("type", productForm.type);
      formData.append("tags", productForm.tags);
      formData.append("sku", productForm.sku);
      formData.append("subCategory", productForm.subCategory);
  
      // Append images (newly uploaded ones only)
      if (productForm.image && productForm.image.length > 0) {
        productForm.image.forEach((img) => {
          formData.append("images", img); // Backend must handle multiple image uploads
        });
      }
  
      // Make API request to update the product
      const response = await axiosInstance.put(`/products/${editingProduct._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Notify user of success
      toast.success("Product updated successfully!");
  
      // Reset form and state
      setProductForm({
        title: "",
        description: "",
        price: "",
        weight: "",
        purity: "",
        type: "",
        tags: "New Arrival",
        sku: "",
        subCategory: "",
        image: null,
        imagePreview: null,
      });
  
      setIsEditMode(false); // Exit edit mode
      setEditingProduct(null); // Clear the editing product
      setIsViewAllProductOpen(false); // Close the modal
  
      // Refresh product list
      await fetchProducts();
    } catch (error) {
      // Handle errors
      const errorMessage = error.response?.data?.message || "Failed to update product. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating product:", error.response || error);
    }
  };
  


  const handleFileImgChange = (e, field) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setProductForm((prevState) => ({
        ...prevState,
        [field]: fileArray,
      }));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/products/${productId}`);
      await fetchProducts(); // Refresh product list after deletion
      toast.success('Product deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting product';
      toast.error(errorMessage);
      console.error('Error deleting product:', error.response?.data || error);
    }
  };

  return (
    <div className="container mx-auto px-4">

      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>

      </div>

      <div className="mb-6">
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Items</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="copper">Copper</option>
        </select>
      </div>

      <div className="space-x-4">
        <Button
          auto
          onClick={() => {
            setIsMainCategoryModalOpen(true);
            setIsEditMode(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Main Category

        </Button>

        <Button
          auto
          onClick={() => setIsSubCategoryModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Subcategory
        </Button>
        <Button
          auto
          onClick={() => setIsProductModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </Button>
      </div>

      {/* main category addform Modal */}
      {/* <Modal isOpen={isViewAllOpen} onClose={toggleViewAll}>
        <ModalContent >
          <ModalHeader>All Main Categories</ModalHeader>
          <ModalBody>

            <Input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={mainCategoryformData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <Textarea
              name="description"
              placeholder="Enter category description"
              value={mainCategoryformData.description}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
            />
            {mainCategoryformData.imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={mainCategoryformData.imagePreview}
                  alt="Selected"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onPress={toggleViewAll}>
              Close
            </Button>
            <Button
              auto
              className="bg-blue-500 text-white"
              onClick={handleAddMainCategory}
            >
              Add
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <Modal isOpen={isViewAllOpen} onClose={toggleViewAll} >
        <ModalContent>
          <ModalHeader>
            {isEditMode ? 'Edit Category' : 'Add New Category'}
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={mainCategoryformData.name}
              onChange={(e) => setMainCategoryFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              fullWidth
            />
            <Textarea
              name="description"
              placeholder="Enter category description"
              value={mainCategoryformData.description}
              onChange={(e) => setMainCategoryFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              fullWidth
            />
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
            />
            {mainCategoryformData.imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={mainCategoryformData.imagePreview}
                  alt="Category Preview"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="secondary"
              onPress={() => {
                toggleViewAll();

              }}
            >
              Close
            </Button>

            <Button
              auto
              className="bg-blue-500 text-white"
              onClick={isEditMode ? handleUpdateCategory : handleAddMainCategory}            >
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Main Category table Modal */}
      <Modal
        isOpen={isMainCategoryModalOpen}
        onOpenChange={() => setIsMainCategoryModalOpen(false)}
      >
        <ModalContent style={{ width: "70%", maxWidth: "900px", marginTop: "400px" }}>
          {(onClose) => (
            <>
              <ModalHeader >
                Add Main Category
                <Button onClick={toggleViewAll}> Add</Button>
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Main Categories Table">
                  <TableHeader>
                    <TableColumn>Images</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {mainCategories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell> <img
                          src={category.image}
                          alt={category.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover'
                          }}
                        /></TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            size="sm"
                            onClick={() => handleEditCategory(category)}                              >
                            <EditIcon />

                          </IconButton>
                          <IconButton
                            color="error"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleDeleteCategory(category._id)}

                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </ModalBody>

              <ModalFooter>
                <Button auto flat onPress={onClose}>
                  Cancel
                </Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add form for subcategory */}
      {/* <Modal
        isOpen={isViewAllSubOpen} onClose={toogleSubViewAll}
        onOpenChange={() => setIsSubCategoryModalOpen(false)}
      >
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader>
                Add Subcategory
              </ModalHeader>
              <ModalBody>

                <Input
                  type="text"
                  name="name"
                  placeholder="Enter subcategory name"
                  value={subCategoryForm.name}
                  onChange={handleSubCategoryInputChange} // Corrected function
                  fullWidth
                />

                <Textarea
                  name="description"
                  placeholder="Enter subcategory description"
                  value={subCategoryForm.description}
                  onChange={handleSubCategoryInputChange} // Corrected function
                  fullWidth
                />

                <select
                  name="mainCategoryId"
                  value={subCategoryForm.mainCategoryId}
                  onChange={handleSubCategoryInputChange} // Corrected function
                  className="w-full border rounded p-2 mt-4"
                >
                  <option value="" disabled>
                    Select Main Category
                  </option>
                  {mainCategories.map((mainCategory) => (
                    <option key={mainCategory._id} value={mainCategory._id}>
                      {mainCategory.name}
                    </option>
                  ))}
                </select>
              </ModalBody>
              <ModalFooter>
                <Button auto flat onClick={() => setIsSubCategoryModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  auto
                  className="bg-blue-500 text-white"
                  onClick={handleAddSubCategory} // Submit action
                >
                  Add Subcategory
                </Button>
              </ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal> */}

      <Modal
        isOpen={isViewAllSubOpen} onClose={toogleSubViewAll}
        onOpenChange={() => setIsSubCategoryModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditMode ? 'Edit Subcategory' : 'Add Subcategory'}
              </ModalHeader>
              <ModalBody>
                {/* Subcategory Name */}
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter subcategory name"
                  value={subCategoryForm.name}
                  onChange={(e) =>
                    setSubCategoryForm({ ...subCategoryForm, name: e.target.value })
                  }
                  fullWidth
                />

                {/* Subcategory Description */}
                <Textarea
                  name="description"
                  placeholder="Enter subcategory description"
                  value={subCategoryForm.description}
                  onChange={(e) =>
                    setSubCategoryForm({ ...subCategoryForm, description: e.target.value })
                  }
                  fullWidth
                />

                {/* Main Category Dropdown */}
                <select
                  name="mainCategoryId"
                  value={subCategoryForm.mainCategoryId}
                  onChange={(e) =>
                    setSubCategoryForm({ ...subCategoryForm, mainCategoryId: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-4"
                >
                  <option value="" disabled>
                    Select Main Category
                  </option>
                  {mainCategories.map((mainCategory) => (
                    <option key={mainCategory._id} value={mainCategory._id}>
                      {mainCategory.name}
                    </option>
                  ))}
                </select>
              </ModalBody>
              <ModalFooter>
                <Button auto flat onClick={() => setIsSubCategoryModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  auto
                  className="bg-blue-500 text-white"
                  onClick={isEditMode ? handleUpdateSubCategory : handleAddSubCategory}
                >
                  {isEditMode ? 'Save Changes' : 'Add Subcategory'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/*table Subcategory Modal */}

      <Modal isOpen={isSubCategoryModalOpen} onClose={() => setIsSubCategoryModalOpen(false)}>
        <ModalContent style={{ width: "70%", maxWidth: "900px", marginTop: "400px" }}>
          <ModalHeader>Add Subcategory
            <Button onClick={toogleSubViewAll}> Add</Button>
          </ModalHeader>
          <ModalBody>
            <Table aria-label="Subcategories Table">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Main Category</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {subCategories?.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>{subcategory.name}</TableCell>
                    <TableCell>{subcategory.description}</TableCell>
                    <TableCell>{subcategory.mainCategory.name}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="sm"
                        onClick={() => handleEditSubCategory(subcategory)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleDeleteSubCategory(subcategory._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onPress={onClose}>
              Cancel
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>



      {/*table Product Modal */}

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}
        onOpenChange={() => setIsProductModalOpen(false)}>
        <ModalContent style={{ width: "80%", maxWidth: "1000px", marginTop: "400px" }}>
          <ModalHeader>Add Product
            <Button onClick={toogleProductViewAll}> Add</Button>
          </ModalHeader>
          <ModalBody>
            <Table aria-label="Subcategories Table">
              <TableHeader>
              <TableColumn>Images</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Weight</TableColumn>
                <TableColumn>Purity</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Tags</TableColumn>
                <TableColumn>Sku</TableColumn>
                <TableColumn>Stock</TableColumn>
                <TableColumn>Actions</TableColumn>

              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{ width: "60px", height: "60px" }}
                      />
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.weight}</TableCell>
                    <TableCell>{product.purity}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>{product.tags}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    {/* Product Stock */}
                    <TableCell>
                      {product.stock ? (
                        <span
                          style={{
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          Stock In
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          Stock Out
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="sm"
                      onClick={() => handleEditProduct(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onPress={onClose}>
              Cancel
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>


      {/* editing product add form */}

      <Modal
        isOpen={isViewAllProductOpen}
        onClose={toogleProductViewAll}
        onOpenChange={() => setIsProductModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Product</ModalHeader>
              <ModalBody>
                {/* Product Title */}
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter product title"
                  value={productForm.title}
                  onChange={handleProductInputChange}
                  fullWidth
                />

                {/* Product Description */}
                <Input
                  name="description"
                  placeholder="Enter product description"
                  value={productForm.description}
                  onChange={handleProductInputChange}
                  fullWidth
                />


                {/* Price */}
                <Input
                  type="number"
                  name="price"
                  placeholder="Enter product price"
                  value={productForm.price}
                  onChange={handleProductInputChange}
                  fullWidth
                />

                {/* Weight */}
                <Input
                  type="number"
                  name="weight"
                  placeholder="Enter product weight (grams)"
                  value={productForm.weight}
                  onChange={handleProductInputChange}
                  fullWidth
                />

                {/* Purity */}
                <Input
                  type="number"
                  name="purity"
                  placeholder="Enter purity percentage"
                  value={productForm.purity}
                  onChange={handleProductInputChange}
                  fullWidth
                />

                {/* Tags */}
                <select
                  name="tags"
                  value={productForm.tags}
                  onChange={handleProductInputChange}
                  className="w-full border rounded p-2 mt-4"
                >
                  <option value="" disabled>Select a Tag</option>
                  {Object.entries(ProductTag).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>

                {/* Type */}
                
                  <select
                    name="type"
                    value={productForm.type}
                    onChange={handleProductInputChange}
                    className="w-full border rounded p-2 mt-4"
                  >
                    <option value="" disabled>
                      Select Commodity Type
                    </option>
                    {commodities.length > 0 ? (
                      commodities.map((commodity) => (
                        <option key={commodity._id} value={commodity.symbol}>
                          {commodity.symbol}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No commodities available
                      </option>
                    )}
                  </select>
              

                {/* SKU */}
                <Input
                  type="text"
                  name="sku"
                  placeholder="Enter SKU value"
                  value={productForm.sku}
                  onChange={handleProductInputChange}
                  fullWidth
                />

                {/* Subcategory Dropdown */}
                <select
                  name="subCategory"
                  value={productForm.subCategory}
                  onChange={handleProductInputChange}
                  className="w-full border rounded p-2 mt-4"
                >
                  <option value="" disabled>
                    Select Subcategory
                  </option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>


                <input
                  type="file"
                  id="file-uploader"
                  accept="image/*"
                  style={{ display: 'none' }} // Hide the input
                  onChange={(e) => handleFileImgChange(e, 'image')}
                  multiple
                />


                <Button
                  variant="contained"
                  component="label"
                  onClick={() => document.getElementById('file-uploader').click()} // Trigger input click
                  sx={{ mt: 2 }}
                >
                  Upload Image
                </Button>


                {productForm.image.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4>Uploaded Images:</h4>
                    <ul>
                      {productForm.image.map((file, index) => (
                        <li key={index}>{file.name}</li> // Display file name
                      ))}
                    </ul>
                  </div>
                )}

              </ModalBody>
              <ModalFooter>
                <Button auto flat onClick={() => setIsViewAllProductOpen(false)}>
                  Cancel
                </Button>
                <Button
                  auto
                  className="bg-blue-500 text-white"
                  onClick={isEditMode ? handleUpdateProduct : handleAddProduct}
                >
                  Add Product
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div>
        {/* Main Categories */}

        <div className="group-button mt-5">
          <h4>MainCategories</h4>
          <ButtonGroup>
            {loading ? (
              <Button disabled>Loading...</Button>
            ) : error ? (
              <Button variant="danger">Error loading categories</Button>
            ) : (
              mainCategories.map((category) => (
                <Button
                  key={category._id}
                  onClick={() => handleMainCategoryClick(category)}
                >
                  {category.name}
                </Button>
              ))
            )}
          </ButtonGroup>
        </div>

        {/* Display Subcategories for the Selected Main Category */}
        {selectedMainCategory && (
          <div>
            {/* <Card className="max-w-[800px] " classNames={{ base: "mt-4" }}>
              <CardHeader className="flex gap-3">

                <div className="flex flex-col">
                  <h3><b>Main Category:</b> {selectedMainCategory.name}</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{selectedMainCategory.description}</p>
              </CardBody>
              <Divider />
              <CardFooter>

              </CardFooter>
            </Card> */}
            <Table aria-label="Products Table" className='mt-2'>
              <TableHeader>
                <TableColumn>Main Category</TableColumn>
                <TableColumn>Description</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedMainCategory.name}</TableCell>
                  <TableCell>{selectedMainCategory.description}</TableCell>
                </TableRow>
              </TableBody>
            </Table>


            <div className='mt-5'>
              <h4>SubCategories</h4>
              <ButtonGroup>
                {filterSubCategories.length > 0 ? (
                  filterSubCategories.map((subCategory) => (
                    <Button
                      key={subCategory._id}
                      onClick={() => handleSubCategoryClick(subCategory)}
                    >
                      {subCategory.name}
                    </Button>
                  ))
                ) : (
                  <p>No subcategories available for this main category.</p>
                )}
              </ButtonGroup>
            </div>

          </div>
        )}

        {/* Display Products */}
        {selectedSubCategory && (
          <div className="product-section mt-5">
            <h3>Products for {selectedSubCategory.name}</h3>
            {error ? (
              <p className="error">{error}</p>
            ) : (
              <div className="product-grid mt-2">
                {filteredProducts.length > 0 ? (
                  <Table aria-label="Products Table">
                    <TableHeader>
                      <TableColumn>Title</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Price</TableColumn>
                      <TableColumn>Purity</TableColumn>
                      <TableColumn>Sku</TableColumn>
                      <TableColumn>Tags</TableColumn>
                      <TableColumn>Weight</TableColumn>

                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product.title}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.purity}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.tags}</TableCell>
                          <TableCell>{product.weight}</TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No products found</p>
                )}

              </div>
            )}
          </div>
        )}


      </div>




    </div>

  );
};




export default Shop;

