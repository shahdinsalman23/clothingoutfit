import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { Plus, Package, Star, CheckCircle2, AlertCircle } from "lucide-react";
import ProductActions from "./ProductActions";
import SuccessPopup from "@/components/admin/SuccessPopup";

const PLACEHOLDER = "/images/placeholders/product-placeholder.png";

function getStock(stock) {
  const value = Number(stock || 0);
  if (value <= 0) return { label: "Out of stock", className: "stock-out-prodad" };
  if (value < 10) return { label: `${value} units · Low`, className: "stock-low-prodad" };
  return { label: `${value} units`, className: "stock-ok-prodad" };
}

export default async function AdminProductsPage({ searchParams }) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      stock,
      is_featured,
      is_active,
      created_at,
      product_images (image_url, sort_order)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load products: ${error.message}`);
  }

  const allProducts = (products || []).map((product) => {
    const sortedImages = [...(product.product_images || [])].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
    return {
      ...product,
      imageUrl: sortedImages[0]?.image_url || PLACEHOLDER,
    };
  });

  const totalProducts = allProducts.length;
  const featuredCount = allProducts.filter((p) => p.is_featured).length;
  const activeCount = allProducts.filter((p) => p.is_active).length;

  return (
    <div className="shopmate-inv-wrapper-prodad container-fluid px-0">

      {/* Top Header Row */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12 col-md-8">
          <span className="shopmate-inv-eyebrow-prodad">INVENTORY MANAGEMENT</span>
          <h1 className="shopmate-inv-title-prodad">Products</h1>
          <p className="shopmate-inv-subtitle-prodad mb-0">
            Manage your store inventory, pricing, images, and featured items seamlessly.
          </p>
        </div>

        <div className="col-12 col-md-auto">
          <Link className="shopmate-inv-primary-btn-prodad" href="/admin/products/new">
            <Plus size={18} className="me-2" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      <SuccessPopup type={params?.success} />

      {/* Error Notification Banner */}
      {params?.error && (
        <div className="shopmate-inv-notice-prodad shopmate-inv-error-notice-prodad mb-4" role="alert">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{params.error}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-prodad">
            <div className="shopmate-stat-icon-wrap-prodad shopmate-icon-primary-prodad">
              <Package size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-prodad">Total Products</span>
              <strong className="shopmate-stat-value-prodad">{totalProducts}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-prodad">
            <div className="shopmate-stat-icon-wrap-prodad shopmate-icon-warning-prodad">
              <Star size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-prodad">Featured Products</span>
              <strong className="shopmate-stat-value-prodad">{featuredCount}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-prodad">
            <div className="shopmate-stat-icon-wrap-prodad shopmate-icon-success-prodad">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-prodad">Active Products</span>
              <strong className="shopmate-stat-value-prodad">{activeCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="shopmate-table-card-prodad">
        <div className="shopmate-table-header-prodad">
          <div>
            <h2 className="shopmate-table-title-prodad">All Products Catalog</h2>
            <p className="shopmate-table-desc-prodad mb-0">
              Complete list of registered store products.
            </p>
          </div>
          <span className="shopmate-table-badge-prodad">{totalProducts} items</span>
        </div>

        {allProducts.length === 0 ? (
          <div className="shopmate-empty-box-prodad">
            <div className="shopmate-empty-icon-wrap-prodad">
              <Package size={40} />
            </div>
            <h3>No products yet</h3>
            <p>Add your first product to start building your store catalog.</p>
            <Link className="shopmate-inv-primary-btn-prodad" href="/admin/products/new">
              <Plus size={18} className="me-2" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive d-none d-lg-block">
              <table className="table shopmate-custom-table-prodad align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Product Info</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((product) => {
                    const stock = getStock(product.stock);
                    return (
                      <tr key={product.id}>
                        <td className="ps-4">
                          <div className="shopmate-prod-cell-prodad">
                            <div className="shopmate-thumb-prodad">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={product.imageUrl} alt={product.name} />
                            </div>
                            <div className="shopmate-prod-name-cell-prodad">
                              <strong>{product.name}</strong>
                              <small>/{product.slug}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="shopmate-price-text-prodad">
                            Rs. {Number(product.price).toLocaleString("en-PK")}
                          </span>
                        </td>

                        <td>
                          <span className={`shopmate-stock-badge-prodad ${stock.className}`}>
                            {stock.label}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`shopmate-badge-prodad ${
                              product.is_featured ? "badge-featured-prodad" : "badge-standard-prodad"
                            }`}
                          >
                            {product.is_featured ? "Featured" : "Standard"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`shopmate-badge-prodad ${
                              product.is_active ? "badge-active-prodad" : "badge-inactive-prodad"
                            }`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="text-end pe-4">
                          <div className="shopmate-action-buttons-prodad">
                            <ProductActions productId={product.id} productName={product.name} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Cards */}
            <div className="shopmate-mobile-list-prodad d-lg-none">
              {allProducts.map((product) => {
                const stock = getStock(product.stock);
                return (
                  <div key={product.id} className="shopmate-mobile-card-prodad">
                    <div className="shopmate-mobile-top-prodad">
                      <div className="shopmate-prod-cell-prodad">
                        <div className="shopmate-thumb-prodad">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.imageUrl} alt={product.name} />
                        </div>
                        <div className="shopmate-prod-name-cell-prodad">
                          <strong>{product.name}</strong>
                          <small>/{product.slug}</small>
                        </div>
                      </div>
                      <ProductActions productId={product.id} productName={product.name} />
                    </div>

                    <div className="shopmate-mobile-stats-prodad">
                      <div>
                        <small>Price</small>
                        <strong>Rs. {Number(product.price).toLocaleString("en-PK")}</strong>
                      </div>
                      <div>
                        <small>Stock</small>
                        <span className={`shopmate-stock-badge-prodad ${stock.className}`}>
                          {stock.label}
                        </span>
                      </div>
                    </div>

                    <div className="shopmate-mobile-badges-prodad">
                      <span
                        className={`shopmate-badge-prodad ${
                          product.is_featured ? "badge-featured-prodad" : "badge-standard-prodad"
                        }`}
                      >
                        {product.is_featured ? "Featured" : "Standard"}
                      </span>
                      <span
                        className={`shopmate-badge-prodad ${
                          product.is_active ? "badge-active-prodad" : "badge-inactive-prodad"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
}