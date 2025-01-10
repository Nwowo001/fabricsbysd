import React, { useState, useEffect } from "react";
import "./Section.css";
import background from "../../assets/background.png";
import me from "../../assets/me.jpg";
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import product5 from "../../assets/product5.jpg";
import product6 from "../../assets/product6.jpg";
import product7 from "../../assets/product7.jpg";
import product8 from "../../assets/product8.jpg";
import product9 from "../../assets/product9.jpg";
import product10 from "../../assets/product10.jpg";
import product11 from "../../assets/product11.jpg";
import product12 from "../../assets/product12.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Section = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const products = [
    { src: product1, title: "Customer in fabricsbysd RTW" },
    { src: product2, title: "Customer in Ankara print" },
    { src: product3, title: "Customer in fabricsbysd RTW" },
    { src: product4, title: "Some Adire print samples" },
    { src: product5, title: "Some Adire print samples" },
    { src: product6, title: "Some Adire print samples" },
    { src: product7, title: "Some Ankara print samples" },
    { src: product8, title: "Ankara print samples" },
    { src: product9, title: "Customer (left) in Ankara print" },
    { src: product10, title: "An Ankara print" },
    { src: product11, title: "Customer rocking an Ankara print" },
    { src: product12, title: "Some Adire prints" },
  ];

  const handleImageClick = (image, title) => {
    setSelectedImage(image);
    setSelectedTitle(title);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedTitle("");
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "+2348163073894"; // Registered WhatsApp number
    const message = encodeURIComponent(
      `Hi, I would like to place an order for "${selectedTitle}".`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="home" id="home">
        <div className="hero-container">
          <img src={background} alt="Hero background" className="hero-image" />
          <div className="hero-content">
            <h1>Welcome to FabricsBySD</h1>
            <p>
              Discover the best solutions for your needs. Let’s build your
              amazing wardrobe together!
            </p>
            <a href="#about" className="cta-button">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-container">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-pic">
              <img src={me} alt="Sarah Dogara - CEO" />
              <p className="about-name">
                Sarah Dogara
                <br />
                <strong>CEO, fabricsbySD</strong>
              </p>
            </div>
            <div className="about-text">
              <h3>fabricsbySD: Taking African Prints to the World</h3>
              <p>
                Welcome to fabricsbySD, where we bring the beauty and vibrancy
                of African fabrics to the world. Our mission is simple: share
                the bold, colourful patterns of Ankara and Adire with global
                fashion lovers, while supporting African artisans and promoting
                sustainability.
              </p>
              <p>
                At fabricsbySD, we offer a stunning collection of authentic
                African fabrics, known for their striking colours and rich
                cultural significance. Whether you're looking for fabric to
                create your designs, update your wardrobe, or add unique accents
                to your home, our fabrics are perfect for any project.
              </p>
              <p>
                We specialize in two iconic African textiles: Ankara (a cotton
                fabric known for its bright, geometric patterns) and Adire (a
                hand-dyed fabric with intricate, symbolic designs). These
                fabrics are deeply rooted in African tradition, each pattern
                telling a unique story.
              </p>
              <p>
                In addition to our fabrics, we offer Ready-to-Wear (RTW)
                clothing, designed to bring African prints into your everyday
                wardrobe. Our RTW collection blends traditional African styles
                with modern trends, offering fashionable pieces for all
                occasions. We’re also expanding to include Ankara bags and
                accessories, so you can take the bold beauty of African prints
                wherever you go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="products">
        <div className="products-container">
          <h2>Our Products</h2>
          <p>
            Explore our diverse range of products crafted with precision and
            care.
          </p>
          <div className="products-pic">
            {products.map((product, index) => (
              <div key={index} className="product-item">
                <img
                  src={product.src}
                  alt={product.title}
                  loading="lazy"
                  onClick={() => handleImageClick(product.src, product.title)}
                />
                <p className="product-title">{product.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
            <img
              src={selectedImage}
              alt="Selected Product"
              className="modal-image"
            />
            <p>{selectedTitle}</p>
            <button
              className="add-to-cart-button"
              onClick={handleWhatsAppOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="contacts" id="contact">
        <div className="contacts-container">
          <h2>Contact Us</h2>
          <p>
            For inquiries, call:
            <a href="tel:+2348163073894">
              <FontAwesomeIcon icon={faPhone} /> 08163073894
            </a>{" "}
            or email us at:
            <a href="mailto:fabricsbysd@gmail.com">fabricsbysd@gmail.com</a>
          </p>
          <p>
            Follow us:
            <FontAwesomeIcon icon={faInstagram} /> fabricsbysd
          </p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2025 FabricsBySD. All rights reserved.</p>
        <p>
          Designed with ❤️ by <a href="#">Victor</a>
        </p>
      </footer>
    </div>
  );
};

export default Section;
