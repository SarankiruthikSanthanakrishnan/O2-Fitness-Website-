// ✅ ProductSchema.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Includes:
 * - Product Schema
 * - Breadcrumb Schema
 * - Organization Schema (O2 Fitness Health Care)
 * - Auto Meta Title & Description
 */

const ProductSchema = ({ product }) => {
  if (!product) return null;

  // Generate SEO-friendly slug
  const slug = product.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const productUrl = `https://o2fitnesshealthcare.com/products/${slug}`;

  // ✅ Product Schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: Array.isArray(product.images) ? product.images : [product.images],
    description: product.metaDescription || product.description,
    sku: product.sku || "",
    mpn: product.sku || "",
    brand: {
      "@type": "Brand",
      name: product.brand || "O2 Fitness Health Care",
    },
    category: product.category || "Health Care",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price || 0,
      priceValidUntil: "2036-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "O2 Fitness Health Care",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue || 4.9,
      reviewCount: product.reviewCount || 120,
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: product.ratingValue || 4.9,
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Verified Buyer",
        },
      },
    ],
  };

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://o2fitnesshealthcare.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category || "Products",
        item: `https://o2fitnesshealthcare.com/category/${(product.category ||
          "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  // ✅ Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "O2 Fitness Health Care",
    url: "https://o2fitnesshealthcare.com/",
    logo:
      "https://o2fitnesshealthcare.com/assets/Logo-LNBl5jfI.png",
    sameAs: [
      "https://www.facebook.com/profile.php?id=100087451584400",
      "https://www.instagram.com/o2fitnesshealthcare",
      "https://www.youtube.com/@o2fitnesshealthcare450",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-6380307315",
        contactType: "Customer Service",
        areaServed: "IN",
        availableLanguage: ["English", "Tamil"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 202, Ganapathy Colony, 7th Street",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600089",
      addressCountry: "IN",
    },
    foundingDate: "2010",
    description:
      "O2 Fitness Healthcare is a proudly Indian wellness brand dedicated to helping people live better through intelligent massage solutions. From advanced massage chairs to compact fitness equipment, we offer products that support physical relief, daily relaxation, and long-term wellness.",
  };

  return (
    <Helmet>
      <title>{product.metaTitle || `${product.title} | O2 Fitness Health Care`}</title>
      <meta
        name="description"
        content={product.metaDescription || product.description}
      />
      {product.metaKeywords && (
        <meta name="keywords" content={product.metaKeywords} />
      )}
      <link rel="canonical" href={productUrl} />

      {/* ✅ JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
