"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
};

type CartItem = Product & {
  quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    fetch("http://127.0.0.1:8001/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products API response:", data);

        // Handle both:
        // 1. [product, product, product]
        // 2. { products: [product, product, product] }

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Unexpected products response:", data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, []);

  // =========================
  // CART FUNCTIONS
  // =========================

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // =========================
  // CART TOTALS
  // =========================

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // =========================
  // SCROLL TO PRODUCTS
  // =========================

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <main>
      {/* =========================
          TOP SHIPPING BAR
      ========================= */}

      <div className="shipping-bar">
        <span>FREE SHIPPING ON ORDERS ABOVE ₹999</span>

        <span className="shipping-divider">|</span>

        <span>EASY 7-DAY RETURNS</span>
      </div>

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <h1>VENSEVEN</h1>

        <nav>
          <a href="#">HOME</a>

          <a href="#products">SHOP</a>

          <a href="#about">ABOUT</a>

          <a href="#contact">CONTACT</a>
        </nav>

        <div className="navbar-actions">

          {/* SEARCH */}

          <button
            className="icon-button"
            aria-label="Search"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="M20 20l-4-4" />
            </svg>
          </button>

          {/* ACCOUNT */}

          <button
            className="icon-button"
            aria-label="Account"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle
                cx="12"
                cy="7"
                r="4"
              />

              <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
            </svg>
          </button>

          {/* CART */}

          <button
            className="cart-button"
            onClick={() => setIsCartOpen(true)}
          >
            CART ({totalItems})
          </button>
        </div>
      </header>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero">

        {/* HERO TEXT */}

        <div className="hero-content">

          <p className="hero-small-text">
            NEW COLLECTION
          </p>

          <h2>
            Style That
            <br />
            Speaks For You
          </h2>

          <p className="hero-description">
            Discover modern men's fashion designed to make
            you look and feel confident.
          </p>

          <button
            className="hero-button"
            onClick={scrollToProducts}
          >
            <span>SHOP NOW</span>

            <span className="arrow">
              →
            </span>
          </button>
        </div>

        {/* 
          IMPORTANT:
          Your hero image is controlled through CSS
          using /hero-model.png.
        */}

      </section>

      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        className="products-section"
        id="products"
      >

        <div className="section-heading">

          <div className="heading-line"></div>

          <div>
            <p className="section-subtitle">
              OUR COLLECTION
            </p>

            <h2>
              Featured Products
            </h2>
          </div>

          <div className="heading-line"></div>

        </div>

        <div className="products-grid">

          {products.length === 0 ? (

            <div className="products-loading">
              <p>Loading products...</p>
            </div>

          ) : (

            products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="product-image">

                  {product.image_url ? (

                    <img
                      src={product.image_url}
                      alt={product.name}
                    />

                  ) : (

                    <div className="image-placeholder">
                      No Image
                    </div>

                  )}

                  <span className="new-badge">
                    NEW
                  </span>

                </div>

                {/* PRODUCT DETAILS */}

                <div className="product-info">

                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-bottom">

                    <span className="price">
                      ₹{product.price}
                    </span>

                    <button
                      className="add-cart-button"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      ADD TO CART
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* =========================
          ABOUT
      ========================= */}

      <section
        className="about-section"
        id="about"
      >

        <p className="section-subtitle">
          ABOUT VENSEVEN
        </p>

        <h2>
          Built For Men Who
          <br />
          Define Their Own Style.
        </h2>

        <p>
          VENSEVEN brings together modern men's fashion,
          everyday comfort and effortless style.
        </p>

      </section>

      {/* =========================
          CONTACT
      ========================= */}

      <section
        className="contact-section"
        id="contact"
      >

        <p className="section-subtitle">
          GET IN TOUCH
        </p>

        <h2>
          We&apos;d Love To Hear From You.
        </h2>

        <p>
          Have a question about an order or product?
          Get in touch with us.
        </p>

      </section>

      {/* =========================
          CART OVERLAY
      ========================= */}

      {isCartOpen && (

        <div
          className="cart-overlay"
          onClick={() =>
            setIsCartOpen(false)
          }
        >

          <div
            className="cart-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CART HEADER */}

            <div className="cart-header">

              <h2>
                Your Cart
              </h2>

              <button
                className="close-cart"
                onClick={() =>
                  setIsCartOpen(false)
                }
              >
                ×
              </button>

            </div>

            {/* EMPTY CART */}

            {cart.length === 0 ? (

              <div className="empty-cart">

                <p>
                  Your cart is empty.
                </p>

                <button
                  onClick={() =>
                    setIsCartOpen(false)
                  }
                >
                  CONTINUE SHOPPING
                </button>

              </div>

            ) : (

              <>

                {/* CART ITEMS */}

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <img
                        src={item.image_url}
                        alt={item.name}
                      />

                      <div className="cart-item-details">

                        <h3>
                          {item.name}
                        </h3>

                        <p className="cart-price">
                          ₹{item.price}
                        </p>

                        {/* QUANTITY */}

                        <div className="quantity-controls">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          className="remove-button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* CART FOOTER */}

                <div className="cart-footer">

                  <div className="cart-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{totalPrice}
                    </strong>

                  </div>

                  <button
                    className="checkout-button"
                  >
                    CHECKOUT
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </main>
  );
}