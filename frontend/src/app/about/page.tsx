'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const productImages = [
    { src: '/assets/product1.jpg', alt: 'Customer in fabricsbysd RTW' },
    { src: '/assets/product2.jpg', alt: 'Customer in Ankara print' },
    { src: '/assets/product3.jpg', alt: 'Customer in fabricsbysd RTW' },
    { src: '/assets/product4.jpg', alt: 'Some Adire print samples' },
    { src: '/assets/product5.jpg', alt: 'Some Adire print samples' },
    { src: '/assets/product6.jpg', alt: 'Some Adire print samples' },
    { src: '/assets/product7.jpg', alt: 'Some Ankara print samples' },
    { src: '/assets/product8.jpg', alt: 'Ankara print samples' },
    { src: '/assets/product9.jpg', alt: 'Customer (left) in Ankara print' },
    { src: '/assets/product10.jpg', alt: 'An ankara print' },
    { src: '/assets/product11.jpg', alt: 'Customer rocking an Ankara print' },
    { src: '/assets/product12.jpg', alt: 'Some Adire prints' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-purple-600">FabricsBySD</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bringing the beauty and vibrancy of African fabrics to the world
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* About Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/me.jpg"
                  alt="Founder of FabricsBySD"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Decorative product images around the main image */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={productImages[0].src}
                  alt={productImages[0].alt}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={productImages[1].src}
                  alt={productImages[1].alt}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={productImages[2].src}
                  alt={productImages[2].alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* About Text */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to FabricsBySD, where we bring the beauty and vibrancy
                of African fabrics to the world. Our mission is simple: share
                the bold, colourful patterns of Ankara and Adire with global
                fashion lovers, while supporting African artisans and promoting
                sustainability.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                At FabricsBySD, we offer a stunning collection of authentic
                African fabrics, known for their striking colours and rich
                cultural significance. Whether you're looking for fabric to
                create your designs, update your wardrobe, or add unique accents
                to your home, our fabrics are perfect for any project.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To share the bold, colourful patterns of Ankara and Adire with global
                fashion lovers, while supporting African artisans and promoting
                sustainability in the fashion industry.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading platform for authentic African fabrics,
                connecting traditional craftsmanship with modern fashion trends
                worldwide.
              </p>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              What We Specialize In
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Ankara Fabrics</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A cotton fabric known for its bright, geometric patterns that are
                  deeply rooted in African tradition. Each pattern tells a unique story
                  and represents different cultural meanings.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={productImages[6].src}
                      alt={productImages[6].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={productImages[7].src}
                      alt={productImages[7].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Adire Fabrics</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hand-dyed fabric with intricate, symbolic designs that showcase
                  the artistry and cultural heritage of African textile traditions.
                  Each piece is a work of art with deep cultural significance.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={productImages[3].src}
                      alt={productImages[3].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={productImages[4].src}
                      alt={productImages[4].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products & Services */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Our Products & Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧵</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fabric Sales</h3>
                <p className="text-gray-700">
                  Authentic African fabrics for all your creative projects
                </p>
              </div>
              
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👗</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready-to-Wear</h3>
                <p className="text-gray-700">
                  Fashionable pieces that blend traditional African styles with modern trends
                </p>
              </div>
              
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👜</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accessories</h3>
                <p className="text-gray-700">
                  Ankara bags and accessories to complete your African-inspired look
                </p>
              </div>
            </div>
          </div>

          {/* Customer Showcase */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Our Happy Customers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productImages.slice(8, 12).map((image, index) => (
                <div key={index} className="relative h-48 rounded-xl overflow-hidden shadow-lg group">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="truncate">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Explore Our Collection?</h2>
            <p className="text-xl mb-8 opacity-90">
              Discover the beauty of authentic African fabrics and find your perfect piece today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
