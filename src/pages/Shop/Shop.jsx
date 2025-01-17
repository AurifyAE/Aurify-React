import {
  Delete as DeleteIcon,
  CheckCircle,
  Block as BlockIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
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
import { Upload, Loader2, Video, X } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MdAddShoppingCart } from "react-icons/md";
import axiosInstance from "../../axios/axiosInstance";
import { IconButton } from "@mui/material";

const ProductTag = {
  BEST_SELLER: "Best Seller",
  SEASONAL: "Seasonal",
  NEW_ARRIVAL: "New Arrival",
  TOP_RATED: "Top Rated",
  EXCLUSIVE: "Exclusive",
  BACK_IN_STOCK: "Back in Stock",
  NONE: "None",
};

const Shop = () => {
  const adminId = localStorage.getItem("adminId");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //banner
  const [isEcomBannerModalOpen, setIsEcomBannerModalOpen] = useState(false);
  const [isViewAllEcomBannerOpen, setIsViewAllEcomBannerOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    image: [],
  });
  const [banners, setBanners] = useState([]);
  //   Order Management
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isViewAllOrderOpen, setIsViewAllOrderOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  console.log(orders);
  // banner Video
  const [isVideoBannerModalOpen, setIsVideoBannerModalOpen] = useState(false);
  const [isViewAllVideoBannerOpen, setIsViewAllVideoBannerOpen] =
    useState(false);
  const [videoBannerForm, setVideoBannerForm] = useState({
    title: "",
    videos: [],
  });
  const [videoBanners, setVideoBanner] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadMode, setUploadMode] = useState("single");
  const fileInputRef = useRef(null);
  //   // maincategory
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
  const [isViewAllSubOpen, setIsViewAllSubOpen] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    description: "",
    mainCategoryId: "",
    createdBy: adminId,
  });
  const [mainCategories, setMainCategories] = useState([]);
  console.log(mainCategories);
  const [subCategories, setSubCategories] = useState([]);

  // product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    weight: "",
    makingCharge: "",
    purity: "",
    type: "",
    tags: "New Arrival",
    sku: "",
    subCategory: "",
    image: [],
  });
  const [products, setProducts] = useState([]);
  const [isViewAllProductOpen, setIsViewAllProductOpen] = useState(false);
  const [commodities, setCommodities] = useState([]);

  const toggleViewAll = () => setIsViewAllOpen(!isViewAllOpen);
  const toogleSubViewAll = () => setIsViewAllSubOpen(!isViewAllSubOpen);
  const toogleProductViewAll = () =>
    setIsViewAllProductOpen(!isViewAllProductOpen);
  const toogleEcomBannerViewAll = () =>
    setIsViewAllEcomBannerOpen(!isViewAllEcomBannerOpen);
  const toogleVideoBannerViewAll = () =>
    setIsViewAllVideoBannerOpen(!isViewAllVideoBannerOpen);
  const toogleOrderViewAll = () => setIsViewAllOrderOpen(!isViewAllOrderOpen);
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
  const [editingEcomBanner, setEditingEcomBanner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchSubCategories();
      await fetchEcomBanner();
      await fetchProducts();
      await fetchCommodities();
      await fetchVideoBanner();
      await fetchAllOrder();
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
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching commodities.";
      toast.error(errorMessage);
      console.error("Error fetching commodities:", error);
    }
  };

  // filter

  const handleMainCategoryClick = async (mainCategory) => {
    try {
      setSelectedMainCategory(mainCategory);
      const response = await axiosInstance.get(
        `/sub-categories/${mainCategory._id}`
      );
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

      const response = await axiosInstance.get(
        `/get-product?subCateId=${subCategory._id}`
      );
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
      const response = await axiosInstance.get(`/main-categories/${adminId}`);
      setMainCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories");
      toast.error("Error loading categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/get-sub-categories/${adminId}`
      );
      setSubCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch subcategories");
      toast.error("Error loading subcategories");
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchEcomBanner = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/banner/${adminId}`);
      setBanners(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch EcomBanner");
      toast.error("Error loading EcomBanner");
      console.error("Error fetching EcomBanner:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoBanner = async () => {
    try {
      const response = await axiosInstance.get(`/videoBanners/${adminId}`);
      setVideoBanner(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch EcomBanner");
      toast.error("Error loading EcomBanner");
      console.error("Error fetching EcomBanner:", err);
    }
  };

  const fetchAllOrder = async () => {
    try {
      const response = await axiosInstance.get(`/booking/${adminId}`);
      setOrders(response.data.orderDetails);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Order Management");
      toast.error("Error loading Order Management");
      console.error("Error fetching Order Management:", err);
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

  const handleEcomBannerInputChange = (e) => {
    const { name, value } = e.target;
    setBannerForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileImgChangeEcomBanner = (e, field) => {
    const files = e.target.files;
    if (files && files?.length > 0) {
      const fileArray = Array.from(files);
      setBannerForm((prevState) => ({
        ...prevState,
        [field]: fileArray,
      }));
    }
  };

  const handleFileChangeEcomBanner = (e) => {
    const file = e.target.files[0];
    setBannerForm((prevData) => ({
      ...prevData,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : "",
    }));
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/main-category/${categoryId}`);
      await fetchCategories();

      // Remove subcategories associated with this category
      const updatedSubCategories = subCategories?.filter(
        (subCat) => subCat.mainCategory !== categoryId
      );
      setSubCategories(updatedSubCategories);

      toast.success("Category  deleted successfully!");
    } catch (error) {
      toast.error("Error deleting category");
      console.error("Error:", error);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);

  //  AddMainCategory function
  const handleAddMainCategory = async () => {
    const formData = new FormData();
    formData.append("image", mainCategoryformData.image);
    formData.append("name", mainCategoryformData.name);
    formData.append("createdBy", adminId);
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
      // await fetchSubCategories();
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
      description: category.description || "",
      image: null,
      imagePreview: category.image,
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
      const response = await axiosInstance.put(
        `/main-category/${editingMainCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      const response = await axiosInstance.post(
        "/sub-category",
        subCategoryForm
      ); // Replace with your endpoint
      setIsSubCategoryModalOpen(false); // Close the modal
      toast.success("Subcategory added successfully!");
      setSubCategoryForm({
        name: "",
        description: "",
        mainCategoryId: "",
      });

      await fetchSubCategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Failed to add subcategory. Please try again.");
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    // Confirm deletion
    if (
      !window.confirm("Are you sure you want to delete this sub-category? ")
    ) {
      return;
    }
    try {
      // Delete from backend
      await axiosInstance.delete(`/sub-category/${subCategoryId}`);

      // Remove from local state
      setSubCategories((prevSubCategories) =>
        prevSubCategories.filter((subCat) => subCat._id !== subCategoryId)
      );

      toast.success(
        "Sub-Category and associated products deleted successfully!"
      );
      await fetchSubCategories();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting sub-category";
      toast.error(errorMessage);
      console.error("Delete Sub-Category Error:", error);
    }
  };
  // -------------------------------
  const handleEditSubCategory = (subCategory) => {
    setIsEditMode(true); // Set edit mode to true
    setEditingSubCategory(subCategory); // Store the selected subcategory for editing
    setSubCategoryForm({
      name: subCategory.name,
      description: subCategory.description || "",
      mainCategoryId: subCategory.mainCategory._id || "", // Assuming mainCategory is an object
    });
    setIsViewAllSubOpen(true); // Open the modal for editing
  };

  const handleUpdateSubCategory = async () => {
    try {
      const response = await axiosInstance.put(
        `/sub-category/${editingSubCategory._id}`,
        subCategoryForm
      );

      toast.success("Subcategory updated successfully!");

      // Reset form and state after successful update
      setSubCategoryForm({
        name: "",
        description: "",
        mainCategoryId: "",
        image: null,
        imagePreview: null,
      });
      setIsEditMode(false); // Exit edit mode
      setEditingSubCategory(null); // Clear the editing subcategory
      setIsSubCategoryModalOpen(false); // Close the modal

      // Refresh subcategories
      await fetchSubCategories();
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("Failed to update subcategory. Please try again.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/get-all-product/${adminId}`);
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Error loading products");
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      // Validation
      if (
        !productForm.title ||
        !productForm.price ||
        !productForm.sku ||
        !productForm.subCategory
      ) {
        toast.error(
          "Please fill in all required fields: Title, Price, SKU, and Subcategory."
        );
        return;
      }
      // Prepare form data
      const formData = new FormData();
      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("price", Number(productForm.price));
      formData.append("weight", Number(productForm.weight));
      formData.append("makingCharge", Number(productForm.makingCharge));
      formData.append("purity", Number(productForm.purity));
      formData.append("type", productForm.type);
      formData.append("tags", productForm.tags);
      formData.append("sku", productForm.sku);
      formData.append("subCategory", productForm.subCategory);

      // Handle image uploads
      if (productForm.image) {
        if (Array.isArray(productForm.image)) {
          productForm.image.forEach((img) => formData.append("image", img));
        } else {
          formData.append("image", productForm.image);
        }
      }

      // Construct the URL with query parameters
      const url = `/products?adminId=${adminId}`;

      // Make the API request
      const response = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Product added:", response.data);

      // Close the modal and reset the form
      setIsViewAllProductOpen(false);
      setProductForm({
        title: "",
        description: "",
        price: "",
        weight: "",
        makingCharge: "",
        purity: "",
        type: "",
        tags: "New Arrival",
        sku: "",
        subCategory: "",
        image: [],
      });
      // Refresh product list
      await fetchProducts();
      toast.success("Product added successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add product.";
      toast.error(errorMessage);
      console.error("Error adding product:", error.response || error);
    }
  };

  // ------------------------

  const handleEditProduct = (product) => {
    setIsEditMode(true); // Enable edit mode
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description || "",
      price: product.price?.toString() || "",
      weight: product.weight?.toString() || "",
      makingCharge: product.makingCharge?.toString() || "",
      type: product.type || "",
      purity: product.purity?.toString() || "",
      tags: product.tag || "New Arrival",
      sku: product.sku,
      subCategory: product.subCategory.toString(),
      image: [],
    });
    setIsViewAllProductOpen(true);
  };
  const handleUpdateProduct = async () => {
    try {
      // Form validation
      if (
        !productForm.title ||
        !productForm.price ||
        !productForm.sku ||
        !productForm.subCategory
      ) {
        toast.error(
          "Please fill in all required fields: Title, Price, SKU, and Subcategory."
        );
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("price", Number(productForm.price)); // Convert to number
      formData.append("weight", Number(productForm.weight));
      formData.append("makingCharge", Number(productForm.makingCharge)); // Convert to number
      formData.append("purity", Number(productForm.purity)); // Convert to number
      formData.append("type", productForm.type);
      formData.append("tags", productForm.tags);
      formData.append("sku", productForm.sku);
      formData.append("subCategory", productForm.subCategory);

      // Append images (newly uploaded ones only)
      if (productForm?.image && productForm?.image.length > 0) {
        productForm.image.forEach((img) => {
          formData.append("image", img); // Backend must handle multiple image uploads
        });
      }

      // Make API request to update the product
      const response = await axiosInstance.put(
        `/products/${editingProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Notify user of success
      toast.success("Product updated successfully!");

      // Reset form and state
      setProductForm({
        title: "",
        description: "",
        price: "",
        weight: "",
        makingCharge: "",
        purity: "",
        type: "",
        tags: "New Arrival",
        sku: "",
        subCategory: "",
        image: [],
        imagePreview: [],
      });

      setIsEditMode(false); // Exit edit mode
      setEditingProduct(null); // Clear the editing product
      setIsViewAllProductOpen(false); // Close the modal

      // Refresh product list
      await fetchProducts();
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update product. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating product:", error.response || error);
    }
  };

  const handleFileImgChange = (e, field) => {
    const files = e.target.files;
    if (files && files?.length > 0) {
      const fileArray = Array.from(files);
      setProductForm((prevState) => ({
        ...prevState,
        [field]: fileArray,
      }));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/products/${productId}`);
      await fetchProducts(); // Refresh product list after deletion
      toast.success("Product deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting product";
      toast.error(errorMessage);
      console.error("Error deleting product:", error.response?.data || error);
    }
  };

  ///banner
  const handleAddEcomBanner = async () => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("title", bannerForm.title);
      formData.append("adminId", adminId);

      // Handle image uploads
      if (bannerForm.image) {
        if (Array.isArray(bannerForm.image)) {
          bannerForm.image.forEach((img) => formData.append("image", img));
        } else {
          formData.append("image", bannerForm.image);
        }
      }

      // Construct the URL with query parameters
      const url = `/addBanner`;

      // Make the API request
      const response = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("EcomBanner added:", response.data);

      // Close the modal and reset the form
      setIsViewAllEcomBannerOpen(false);
      setBannerForm({
        title: "",
        image: null,
      });

      toast.success("EcomBanner added successfully!");
      // Refresh EcomBanner list
      await fetchEcomBanner();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add EcomBanner.";
      toast.error(errorMessage);
      console.error("Error adding EcomBanner:", error.response || error);
    }
  };

  const handleEditEcomBanner = (banner) => {
    setIsEditMode(true); // Enable edit mode
    setEditingEcomBanner(banner);
    setBannerForm({
      title: banner.title,
      image: [],
    });
    setIsViewAllEcomBannerOpen(true);
  };

  const handleUpdateEcomBanner = async () => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("title", bannerForm.title);
      formData.append("adminId", adminId);

      // Append images (newly uploaded ones only)
      if (bannerForm.image && bannerForm.image.length > 0) {
        bannerForm.image.forEach((img) => {
          formData.append("image", img); // Backend must handle multiple image uploads
        });
      }

      // Make API request to update the product
      const response = await axiosInstance.put(
        `/banner/${editingEcomBanner._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Notify user of success
      toast.success("EcomBanner updated successfully!");

      // Reset form and state
      setBannerForm({
        title: "",
        image: null,
        imagePreview: null,
      });

      setIsEditMode(false); // Exit edit mode
      setEditingEcomBanner(null); // Clear the editing product
      setIsViewAllEcomBannerOpen(false); // Close the modal

      // Refresh EcomBanner list
      await fetchEcomBanner();
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update EcomBanner. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating EcomBanner:", error.response || error);
    }
  };

  const handleDeleteEcomBanner = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this EcomBanner?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/banner/${bannerId}/${adminId}`);
      await fetchProducts(); // Refresh product list after deletion
      toast.success("EcomBanner deleted successfully");
      // Refresh EcomBanner list
      await fetchEcomBanner();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting EcomBanner";
      toast.error(errorMessage);
      console.error(
        "Error deleting EcomBanner:",
        error.response?.data || error
      );
    }
  };

  const handleInputVideoBannerChange = (e) => {
    const { name, value } = e.target;
    setVideoBannerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoBannerChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate files
    const validFiles = files.filter((file) => {
      const isVideo = file.type.startsWith("video/");
      const isValidSize = file.size <= 500 * 1024 * 1024; // 500MB
      return isVideo && isValidSize;
    });

    if (validFiles.length === 0) {
      setMessage({
        type: "error",
        text: "Please select valid video files under 500MB",
      });
      return;
    }

    if (uploadMode === "single") {
      setVideoBannerForm((prev) => ({
        ...prev,
        videos: validFiles.slice(0, 1),
      }));
    } else {
      setVideoBannerForm((prev) => ({
        ...prev,
        videos: [...prev.videos, ...validFiles].slice(0, 5),
      }));
    }

    // Reset input
    fileInputRef.current.value = "";
  };

  const removeVideo = (index) => {
    setVideoBannerForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitVideoBanner = async () => {
    if (!videoBannerForm.title.trim()) {
      setMessage({ type: "error", text: "Please enter a title" });
      return;
    }

    if (videoBannerForm.videos.length === 0) {
      setMessage({ type: "error", text: "Please select at least one video" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      console.log(videoBannerForm);
      const formData = new FormData();
      formData.append("title", videoBannerForm.title);

      videoBannerForm.videos.forEach((video, index) => {
        formData.append("video", video);
      });
      console.log(adminId);
      const response = await axiosInstance.post(
        `/video-banner/create/${adminId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) throw new Error("Upload failed");

      // Close the modal and reset the form
      setIsViewAllVideoBannerOpen(false);
      toast.success(response.data.message);

      // Reset form
      setVideoBannerForm({ title: "", videos: [] });

      await fetchVideoBanner();
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: "Failed to save banner. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideoBanner = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this VideoBanner?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/videoBanner/${bannerId}/${adminId}`);
      await fetchProducts(); // Refresh product list after deletion
      toast.success("VideoBanner deleted successfully");
      // Refresh VideoBanner list
      await fetchVideoBanner();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting VideoBanner";
      toast.error(errorMessage);
      console.error(
        "Error deleting VideoBanner:",
        error.response?.data || error
      );
    }
  };
  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
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

        <Button
          auto
          onClick={() => {
            setIsEcomBannerModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Ecom Banner
        </Button>
        <Button
          auto
          onClick={() => {
            setIsVideoBannerModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Video Banner
        </Button>
        <Button
          auto
          onClick={() => {
            setIsOrderModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Order Management
        </Button>
      </div>

      <Modal isOpen={isViewAllOpen} onClose={toggleViewAll}>
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Category" : "Add New Category"}
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={mainCategoryformData.name}
              onChange={(e) =>
                setMainCategoryFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              fullWidth
            />
            <Textarea
              name="description"
              placeholder="Enter category description"
              value={mainCategoryformData.description}
              onChange={(e) =>
                setMainCategoryFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
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
              onClick={
                isEditMode ? handleUpdateCategory : handleAddMainCategory
              }
            >
              {isEditMode ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Main Category table Modal */}
      <Modal
        isOpen={isMainCategoryModalOpen}
        onOpenChange={() => setIsMainCategoryModalOpen(false)}
      >
        <ModalContent
          style={{ width: "70%", maxWidth: "900px", marginTop: "400px" }}
        >
          {(onClose) => (
            <>
              <ModalHeader>
                Add Main Category
                <Button className="ml-3" onClick={toggleViewAll}>
                  {" "}
                  Add
                </Button>
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
                        <TableCell>
                          {" "}
                          <img
                            src={category.image}
                            alt={category.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
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

      <Modal
        isOpen={isViewAllSubOpen}
        onClose={toogleSubViewAll}
        onOpenChange={() => setIsSubCategoryModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
              </ModalHeader>
              <ModalBody>
                {/* Subcategory Name */}
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter subcategory name"
                  value={subCategoryForm.name}
                  onChange={(e) =>
                    setSubCategoryForm({
                      ...subCategoryForm,
                      name: e.target.value,
                    })
                  }
                  fullWidth
                />

                {/* Subcategory Description */}
                <Textarea
                  name="description"
                  placeholder="Enter subcategory description"
                  value={subCategoryForm.description}
                  onChange={(e) =>
                    setSubCategoryForm({
                      ...subCategoryForm,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                />

                {/* Main Category Dropdown */}
                <select
                  name="mainCategoryId"
                  value={subCategoryForm.mainCategoryId}
                  onChange={(e) =>
                    setSubCategoryForm({
                      ...subCategoryForm,
                      mainCategoryId: e.target.value,
                    })
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
                <Button
                  auto
                  flat
                  onClick={() => setIsSubCategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  auto
                  className="bg-blue-500 text-white"
                  onClick={
                    isEditMode ? handleUpdateSubCategory : handleAddSubCategory
                  }
                >
                  {isEditMode ? "Save Changes" : "Add Subcategory"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/*table Subcategory Modal */}

      <Modal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        onOpenChange={() => setIsSubCategoryModalOpen(false)}
      >
        <ModalContent
          style={{ width: "70%", maxWidth: "900px", marginTop: "400px" }}
        >
          <ModalHeader>
            Add Subcategory
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

      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onOpenChange={() => setIsProductModalOpen(false)}
      >
        <ModalContent
          style={{ width: "80%", maxWidth: "1000px", marginTop: "400px" }}
        >
          <ModalHeader>
            Add Product
            <Button className="ml-3" onClick={toogleProductViewAll}>
              {" "}
              Add
            </Button>
          </ModalHeader>
          <ModalBody>
            <Table aria-label="Subcategories Table">
              <TableHeader>
                <TableColumn>Images</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Weight</TableColumn>
                <TableColumn>makingCharge</TableColumn>
                <TableColumn>Purity</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Tags</TableColumn>
                <TableColumn>Sku</TableColumn>
                <TableColumn>Stock</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {products && products?.length > 0 ? (
                  products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product?.images[0]}
                          alt={product.title}
                          style={{ width: "60px", height: "60px" }}
                        />
                      </TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.weight}</TableCell>
                      <TableCell>{product.makingCharge}</TableCell>
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
                        {/* <IconButton
                        color="error"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton> */}
                        {product.stock ? (
                          <CheckCircle
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              cursor: "pointer",
                              color: "green",
                            }}
                          />
                        ) : (
                          <BlockIcon
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              cursor: "pointer",
                              color: "red",
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                      <div className="text-center">No products available</div>
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                )}
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
                {/* makingCharge */}
                <Input
                  type="number"
                  name="makingCharge"
                  placeholder="Enter product makingCharge (%)"
                  value={productForm.makingCharge}
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
                  <option value="" disabled>
                    Select a Tag
                  </option>
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
                  style={{ display: "none" }} // Hide the input
                  onChange={(e) => handleFileImgChange(e, "image")}
                  multiple
                />

                <Button
                  variant="contained"
                  component="label"
                  onClick={() =>
                    document.getElementById("file-uploader").click()
                  } // Trigger input click
                  sx={{ mt: 2 }}
                >
                  Upload Image
                </Button>

                {productForm?.image.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
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
                <Button
                  auto
                  flat
                  onClick={() => setIsViewAllProductOpen(false)}
                >
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

      {/*table Banner Modal */}

      <Modal
        isOpen={isEcomBannerModalOpen}
        onClose={() => setIsEcomBannerModalOpen(false)}
        onOpenChange={() => setIsEcomBannerModalOpen(false)}
      >
        <ModalContent
          style={{ width: "80%", maxWidth: "1000px", marginTop: "400px" }}
        >
          <ModalHeader>
            Add Ecom Banner
            <Button className="ml-3" onClick={toogleEcomBannerViewAll}>
              Add
            </Button>
          </ModalHeader>
          <ModalBody>
            <Table aria-label="Banners Table">
              <TableHeader>
                <TableColumn>Images</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {banners && banners?.length > 0 ? (
                  banners?.map((banner) => (
                    <TableRow key={banner._id}>
                      <TableCell>
                        {banner.imageUrl && banner.imageUrl[0] && (
                          <img
                            src={banner.imageUrl[0]}
                            alt={banner.title}
                            style={{ width: "60px", height: "60px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{banner.title}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          size="sm"
                          onClick={() => handleEditEcomBanner(banner)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleDeleteEcomBanner(banner._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                      <div className="text-center">No banners available</div>
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onPress={() => setIsEcomBannerModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* editing banner add form */}

      <Modal
        isOpen={isViewAllEcomBannerOpen}
        onClose={toogleEcomBannerViewAll}
        onOpenChange={() => setIsEcomBannerModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Ecom Banner</ModalHeader>
              <ModalBody>
                {/* Product Title */}
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter product title"
                  value={bannerForm.title}
                  onChange={handleEcomBannerInputChange}
                  fullWidth
                />

                <input
                  type="file"
                  id="file-uploader"
                  accept="image/*"
                  style={{ display: "none" }} // Hide the input
                  onChange={(e) => handleFileImgChangeEcomBanner(e, "image")}
                  multiple
                />

                <Button
                  variant="contained"
                  component="label"
                  onClick={() =>
                    document.getElementById("file-uploader").click()
                  } // Trigger input click
                  sx={{ mt: 2 }}
                >
                  Upload Image
                </Button>

                {bannerForm.image && bannerForm.image.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h4>Uploaded Images:</h4>
                    <ul>
                      {Array.from(bannerForm.image).map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  auto
                  flat
                  onClick={() => setIsViewAllEcomBannerOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  auto
                  className="bg-blue-500 text-white"
                  onClick={
                    isEditMode ? handleUpdateEcomBanner : handleAddEcomBanner
                  }
                >
                  Add Ecom Banner
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/*table VidoeBanner Modal */}

      <Modal
        isOpen={isVideoBannerModalOpen}
        onClose={() => setIsVideoBannerModalOpen(false)}
        onOpenChange={() => setIsVideoBannerModalOpen(false)}
      >
        <ModalContent
          style={{ width: "80%", maxWidth: "1000px", marginTop: "700px" }}
        >
          <ModalHeader>
            Add Video Banner
            <Button className="ml-3" onClick={toogleVideoBannerViewAll}>
              Add
            </Button>
          </ModalHeader>
          <ModalBody>
            <Table aria-label="Banners Table">
              <TableHeader>
                <TableColumn>Video</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {videoBanners && videoBanners?.length > 0 ? (
                  videoBanners?.map((banner, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {banner.videos && banner.videos.length > 0 ? (
                          <Slider
                            dots={true}
                            infinite={false}
                            speed={500}
                            slidesToShow={3}
                            slidesToScroll={1}
                          >
                            {banner.videos.map((video, index) => (
                              <div key={index}>
                                <video
                                  src={video.location}
                                  controls
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                              </div>
                            ))}
                          </Slider>
                        ) : (
                          <span>No Videos Available</span>
                        )}
                      </TableCell>
                      <TableCell>{banner.title}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleDeleteVideoBanner(banner._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
                      <div className="text-center">
                        No Video Banners Available
                      </div>
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onPress={() => setIsEcomBannerModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* editing videobanner add form */}

      <Modal
        isOpen={isViewAllVideoBannerOpen}
        onClose={toogleVideoBannerViewAll}
        onOpenChange={() => setIsVideoBannerModalOpen(false)}
      >
        <ModalContent>
          <div className="flex justify-between items-center p-4 border-b">
            <ModalHeader className="p-0">Add Video Banner</ModalHeader>
            <div className="flex gap-2">
              <button
                onClick={() => setUploadMode("single")}
                className={`px-4 py-1 rounded text-sm ${
                  uploadMode === "single"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setUploadMode("multiple")}
                className={`px-4 py-1 rounded text-sm ${
                  uploadMode === "multiple"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Multiple
              </button>
            </div>
          </div>

          <ModalBody className="gap-4">
            <Input
              label="Banner Title"
              type="text"
              name="title"
              value={videoBannerForm.title}
              onChange={handleInputVideoBannerChange}
              placeholder="Enter banner title"
              className="w-full"
            />

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                name="video"
                ref={fileInputRef}
                onChange={handleVideoBannerChange}
                accept="video/*"
                multiple={uploadMode === "multiple"}
                className="hidden"
              />
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click or drag videos to upload
                {uploadMode === "multiple" && " (up to 5 videos)"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: 500MB
              </p>
            </div>

            {/* Selected Videos Preview */}
            {videoBannerForm.videos.length > 0 && (
              <div className="space-y-2">
                {videoBannerForm.videos.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium truncate max-w-[200px]">
                          {video.name}
                        </p>
                        <p className="text-gray-500">
                          {(video.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeVideo(index)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <div
                className={`p-2 rounded text-sm ${
                  message.type === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button auto flat onClick={onClose}>
              Cancel
            </Button>
            <Button
              auto
              className={`${
                uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
              onClick={handleSubmitVideoBanner}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              ) : isEditMode ? (
                "Update Video Banner"
              ) : (
                "Add Video Banner"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/*table Order Management  Modal */}

      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onOpenChange={() => setIsOrderModalOpen(false)}
      >
        <ModalContent
          style={{ width: "80%", maxWidth: "1000px", marginTop: "100px" }}
        >
          <ModalHeader>Order Management</ModalHeader>
          <ModalBody>
            <Table aria-label="Order Table">
              <TableHeader>
                <TableColumn>Product</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Weight</TableColumn>
                <TableColumn>MakingCharge</TableColumn>
                <TableColumn>User Name</TableColumn>
                <TableColumn>Contact</TableColumn>
                <TableColumn>Location</TableColumn>
                <TableColumn>Delivery Date</TableColumn>
                <TableColumn>PaymentMethod</TableColumn>
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((orderItem, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {orderItem.productDetails.map((product, idx) => (
                          <div key={idx}>
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover"
                            />
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {orderItem.productDetails.map((product, idx) => (
                          <div key={idx}>{product.title || "N/A"}</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {orderItem.productDetails.map((product, idx) => (
                          <div key={idx}>${product.price || "0.00"}</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {orderItem.productDetails.map((product, idx) => (
                          <div key={idx}>{product.weight || "0"}g</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {orderItem.productDetails.map((product, idx) => (
                          <div key={idx}>{product.makingCharge || "0"}%</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {orderItem.userDetails?.users?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {orderItem.userDetails?.users?.contact || "N/A"}
                      </TableCell>
                      <TableCell>
                        {orderItem.userDetails?.users?.location || "N/A"}
                      </TableCell>
                      <TableCell>
                        {orderItem.deliveryDate
                          ? new Date(
                              orderItem.deliveryDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{orderItem.paymentMethod || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell  className="text-center">
                      No Orders Available
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onPress={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*  pr add form */}

      <div>
        {/* Main Categories */}

        <div className="group-button mt-5">
          <h4>MainCategories</h4>
          <ButtonGroup>
            {mainCategories && mainCategories?.length > 0 ? (
              mainCategories?.map((category) => (
                <Button
                  key={category._id}
                  onClick={() => handleMainCategoryClick(category)}
                >
                  {category.name}
                </Button>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-center">No mainCategories Available</div>
                </TableCell>
              </TableRow>
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
            <Table aria-label="Products Table" className="mt-2">
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

            <div className="mt-5">
              <h4>SubCategories</h4>
              <ButtonGroup>
                {filterSubCategories?.length > 0 ? (
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
                {filteredProducts?.length > 0 ? (
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
                      {filteredProducts?.map((product) => (
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
