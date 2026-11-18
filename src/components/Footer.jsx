
import React from 'react'
import ScrollReveal from './ScrollReveal'

function Footer() {
  return (
    <footer className="bg-[#F5F0E8] text-[#2B2926] px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-14 mt-12">

      {/* Footer Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">

        {/* Brand */}
        <ScrollReveal direction="up" delay={0} duration={750} once={false}>
          <div className="footer-column">

            <h1 className="footer-logo font-serif text-2xl sm:text-3xl font-medium tracking-wide">
              VELAURA
            </h1>

            <p className="mt-1 text-[9px] tracking-[3px] text-gray-600">
              ACCESSORIES
            </p>

            <p className="mt-5 max-w-[240px] text-sm leading-relaxed text-gray-600">
              Thoughtfully chosen accessories to complete your everyday style.
            </p>

          </div>
        </ScrollReveal>

        {/* Shop */}
        <ScrollReveal direction="up" delay={120} duration={750} once={false}>
          <div className="footer-column">

            <h2 className="footer-heading mb-5 text-xs tracking-[2px] font-medium">
              SHOP
            </h2>

            <div className="space-y-2.5 text-sm text-gray-600">
              <p className="footer-link">Jewelry</p>
              <p className="footer-link">Watches</p>
              <p className="footer-link">Bags</p>
              <p className="footer-link">Sunglasses</p>
              <p className="footer-link">Wallets</p>
              <p className="footer-link">Hair Accessories</p>
              <p className="footer-link">Beauty Accessories</p>
            </div>

          </div>
        </ScrollReveal>

        {/* Quick Links */}
        <ScrollReveal direction="up" delay={240} duration={750} once={false}>
          <div className="footer-column">

            <h2 className="footer-heading mb-5 text-xs tracking-[2px] font-medium">
              QUICK LINKS
            </h2>

            <div className="space-y-2.5 text-sm text-gray-600">
              <p className="footer-link">Home</p>
              <p className="footer-link">Shop</p>
              <p className="footer-link">About</p>
              <p className="footer-link">Wishlist</p>
              <p className="footer-link">Cart</p>
            </div>

          </div>
        </ScrollReveal>

        {/* Help */}
        <ScrollReveal direction="up" delay={360} duration={750} once={false}>
          <div className="footer-column">

            <h2 className="footer-heading mb-5 text-xs tracking-[2px] font-medium">
              HELP
            </h2>

            <div className="space-y-2.5 text-sm text-gray-600">
              <p className="footer-link">Contact</p>
              <p className="footer-link">FAQ</p>
              <p className="footer-link">Shipping</p>
              <p className="footer-link">Returns</p>
            </div>

          </div>
        </ScrollReveal>

      </div>

      {/* Copyright */}
      <ScrollReveal direction="fade" delay={200} duration={900} once={false}>
        <div className="footer-bottom border-t border-[#DCCFBE] mt-10 pt-6">

          <p className="text-center text-xs sm:text-sm text-gray-500">
            © 2026 VELAURA. All rights reserved.
          </p>

        </div>
      </ScrollReveal>

      {/* Footer Hover Animations */}
      <style>{`

        .footer-logo {
          transition: letter-spacing 0.4s ease, color 0.4s ease;
        }

        .footer-logo:hover {
          letter-spacing: 0.12em;
          color: #9A7958;
        }

        .footer-heading {
          transition: color 0.3s ease;
        }

        .footer-column:hover .footer-heading {
          color: #9A7958;
        }

        .footer-link {
          width: fit-content;
          cursor: default;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .footer-link:hover {
          color: #9A7958;
          transform: translateX(5px);
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-logo,
          .footer-link,
          .footer-heading {
            transition: none !important;
          }
        }

      `}</style>

    </footer>
  )
}

export default Footer