"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import {
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { Product, PaginationParams } from "@/types";
import { productsAPI } from "@/lib/api";
import { useCartStore } from "@/store/useStore";
import toast from "react-hot-toast";
import Image from "next/image";

const ProductsPageContent = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sort: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const { addItem } = useCartStore();

  const categories = [
    { value: "", label: "All Categories" },
    { value: "ankara", label: "Ankara" },
    { value: "adire", label: "Adire" },
    { value: "rtw", label: "Ready-to-Wear" },
    { value: "accessories", label: "Accessories" },
    { value: "bags", label: "Bags" },
  ];

  const sortOptions = [
    { value: "createdAt-desc", label: "Newest First" },
    { value: "createdAt-asc", label: "Oldest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "averageRating-desc", label: "Highest Rated" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts(filters);
      if (response.data.success) {
        setProducts(response.data.products);
        setPagination({
          total: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      _id: `${product._id}-${Date.now()}`,
      product,
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
    toast.success("Added to cart!");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    );
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleFilterChange("page", i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            i === pagination.currentPage
              ? "bg-purple-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handleFilterChange("page", pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handleFilterChange("page", pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.category
              ? categories.find((c) => c.value === filters.category)?.label
              : "All Products"}
          </h1>
          <p className="text-gray-600">{pagination.total} products found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </form>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    handleFilterChange("sort", sort);
                    handleFilterChange("order", order);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() =>
                  setFilters({
                    page: 1,
                    limit: 12,
                    search: "",
                    category: "",
                    sort: "createdAt",
                    order: "desc",
                  })
                }
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm animate-pulse"
                  >
                    <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
                        <Image
                          src={product.images?.[0]?.url || "/placeholder.jpg"}
                          alt={product.name}
                          width={400}
                          height={256}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Desktop hover overlay */}
                        <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                            <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                              <HeartIcon className="h-5 w-5 text-gray-600" />
                            </button>
                            <Link
                              href={`/products/${product._id}`}
                              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <EyeIcon className="h-5 w-5 text-gray-600" />
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        {/* Mobile buttons - always visible */}
                        <div className="md:hidden absolute top-2 right-2 flex flex-col space-y-2">
                          <button className="p-2 bg-white bg-opacity-90 rounded-full shadow-md">
                            <HeartIcon className="h-4 w-4 text-gray-600" />
                          </button>
                          <Link
                            href={`/products/${product._id}`}
                            className="p-2 bg-white bg-opacity-90 rounded-full shadow-md"
                          >
                            <EyeIcon className="h-4 w-4 text-gray-600" />
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-white bg-opacity-90 rounded-full shadow-md"
                          >
                            <ShoppingCartIcon className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderStars(product.averageRating)}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            ({product.totalReviews})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₦{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₦{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                          </div>
                          <span className="text-xs text-gray-500 capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12">{renderPagination()}</div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      page: 1,
                      limit: 12,
                      search: "",
                      category: "",
                      sort: "createdAt",
                      order: "desc",
                    })
                  }
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
