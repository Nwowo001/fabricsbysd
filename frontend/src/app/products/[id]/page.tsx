'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { useCartStore } from '@/store/useStore';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getProduct(params.id as string);
      if (response.data.success) {
        setProduct(response.data.product);
        if (response.data.product.sizes?.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
        if (response.data.product.colors?.length > 0) {
          setSelectedColor(response.data.product.colors[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      _id: `${product._id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
      addedAt: new Date().toISOString()
    });
    toast.success('Added to cart!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ? (
        <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-5 w-5 text-gray-300" />
      )
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {renderStars(product.averageRating)}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({product.totalReviews} reviews)
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="ml-2 text-xl text-gray-500 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-sm font-medium rounded-md border ${
                          selectedSize === size
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md border ${
                          selectedColor === color.name
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock} items available
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-24">Category:</dt>
                    <dd className="text-sm text-gray-900 capitalize">{product.category}</dd>
                  </div>
                  {product.material && (
                    <div className="flex">
                      <dt className="text-sm font-medium text-gray-500 w-24">Material:</dt>
                      <dd className="text-sm text-gray-900">{product.material}</dd>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex">
                      <dt className="text-sm font-medium text-gray-500 w-24">Origin:</dt>
                      <dd className="text-sm text-gray-900">{product.origin}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}