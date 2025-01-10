import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close menu after clicking a link
  };

  const handleScroll = () => {
    setScrolling(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-container ${scrolling ? "scrolling" : ""}`}>
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="#home" onClick={(e) => handleLinkClick(e, "#home")}>
            <img src={logo} alt="Website Logo" />
          </a>
        </div>
        {/* Hamburger Menu */}
        <div
          className="hamburger-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsMenuOpen((prev) => !prev);
            }
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        {/* Navbar Links */}
        <ul className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <li>
            <a href="#home" onClick={(e) => handleLinkClick(e, "#home")}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleLinkClick(e, "#about")}>
              About
            </a>
          </li>
          <li>
            <a
              href="#products"
              onClick={(e) => handleLinkClick(e, "#products")}
            >
              Products
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
