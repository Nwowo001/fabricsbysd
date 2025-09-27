'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRightIcon, 
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { useCartStore } from '@/store/useStore';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productsAPI.getProducts({ 
          featured: true, 
          limit: 8 
        });
        if (response.data.success) {
          setFeaturedProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      _id: `${product._id}-${Date.now()}`,
      product,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    toast.success('Added to cart!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ? (
        <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover the Beauty of
                <span className="block text-yellow-300">African Fabrics</span>
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed">
                Experience the vibrant colors and rich cultural heritage of authentic 
                Ankara and Adire prints. From ready-to-wear clothing to stunning 
                accessories, bring African fashion into your wardrobe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-purple-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  Shop Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-900 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Image
                    src="/assets/product1.jpg"
                    alt="African Fabric"
                    width={300}
                    height={256}
                    className="h-64 w-full object-cover rounded-lg shadow-lg"
                  />
                  <Image
                    src="/assets/product2.jpg"
                    alt="African Fabric"
                    width={300}
                    height={128}
                    className="h-32 w-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <Image
                    src="/assets/product3.jpg"
                    alt="African Fabric"
                    width={300}
                    height={128}
                    className="h-32 w-full object-cover rounded-lg shadow-lg"
                  />
                  <Image
                    src="/assets/product4.jpg"
                    alt="African Fabric"
                    width={300}
                    height={256}
                    className="h-64 w-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of authentic African fabrics and fashion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Ankara', href: '/products?category=ankara', color: 'from-red-500 to-pink-500' },
              { name: 'Adire', href: '/products?category=adire', color: 'from-blue-500 to-indigo-500' },
              { name: 'Ready-to-Wear', href: '/products?category=rtw', color: 'from-green-500 to-teal-500' },
              { name: 'Accessories', href: '/products?category=accessories', color: 'from-yellow-500 to-orange-500' },
              { name: 'Bags', href: '/products?category=bags', color: 'from-purple-500 to-pink-500' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selections showcasing the finest African fabrics and designs
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
          <Image
                      src={product.images[0]?.url || '/placeholder.jpg'}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                          <HeartIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                          <EyeIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
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
                        {product.originalPrice && product.originalPrice > product.price && (
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
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All Products
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About FabricsBySD
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We are passionate about bringing the beauty and vibrancy of African 
                fabrics to the world. Our mission is to share the bold, colorful 
                patterns of Ankara and Adire with global fashion lovers while 
                supporting African artisans and promoting sustainability.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From authentic fabrics to ready-to-wear clothing and accessories, 
                we offer a stunning collection that celebrates African culture and 
                craftsmanship. Each piece tells a unique story and brings a touch 
                of African elegance to your wardrobe.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
              >
                Learn More About Us
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Image
                    src="/assets/product5.jpg"
                    alt="African Fashion"
                    width={300}
                    height={192}
                    className="h-48 w-full object-cover rounded-lg shadow-lg"
                  />
                  <Image
                    src="/assets/product6.jpg"
                    alt="African Accessories"
                    width={300}
                    height={128}
                    className="h-32 w-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <Image
                    src="/assets/product7.jpg"
                    alt="African Bags"
                    width={300}
                    height={128}
                    className="h-32 w-full object-cover rounded-lg shadow-lg"
                  />
                  <Image
                    src="/assets/product8.jpg"
                    alt="African Textiles"
                    width={300}
                    height={192}
                    className="h-48 w-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;