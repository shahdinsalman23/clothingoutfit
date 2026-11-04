
import Link from "next/link";
import {
  ArrowLeft,
  PackagePlus,
  ImagePlus,
  SlidersHorizontal,
  Save,
  AlertCircle,
  Layers3,
  CircleDollarSign,
  Boxes,
} from "lucide-react";


import { SaveButton, SavingOverlay } from "@/components/admin/ProductFormStatus";
import { requireAdmin } from "@/lib/admin";
import { createProduct } from "@/app/actions/products";
import "./product-form.css";

export default async function NewProductPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(`Unable to load categories: ${error.message}`);
  }

  const activeCategories = categories || [];

  return (
    <main className="product-form-page-prodform container">
      {/* Page Header */}
      <div className="product-form-header-prodform row">
        <div className="col-12 col-lg-8">
          <Link
            href="/admin/products"
            className="product-back-link-prodform"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Products</span>
          </Link>

          <div className="product-form-heading-prodform">
            <span className="product-form-eyebrow-prodform">
              INVENTORY MANAGEMENT
            </span>

            <h1>Add New Product</h1>

            <p>
              Create and configure a new product for your Clothing Outfits store.
              Manage pricing, inventory, product imagery and visibility
              from one place.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="product-form-header-card-prodform">
            <div className="product-form-header-icon-prodform">
              <PackagePlus size={23} aria-hidden="true" />
            </div>

            <div>
              <strong>New Product</strong>
              <span>Product setup and configuration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {params?.error && (
        <div
          className="product-form-notice-prodform"
          role="alert"
        >
          <div className="product-form-notice-icon-prodform">
            <AlertCircle size={19} aria-hidden="true" />
          </div>

          <div>
            <strong>Unable to save product</strong>
            <p>{params.error}</p>
          </div>
        </div>
      )}

      <form
        action={createProduct}
        className="product-form-prodform"
      >
        <SavingOverlay />
        <div className="product-form-layout-prodform row">
          {/* Main Form Column */}
          <div className="col-12 col-xl-8">
            <div className="product-form-main-prodform">
              {/* Product Information */}
              <section className="product-form-card-prodform">
                <div className="product-form-card-heading-prodform">
                  <div className="product-form-section-icon-prodform product-form-section-icon-blue-prodform">
                    <PackagePlus size={20} aria-hidden="true" />
                  </div>

                  <div>
                    <h2>Product Information</h2>
                    <p>
                      Enter the essential details of your product.
                    </p>
                  </div>
                </div>

                <div className="product-form-fields-prodform row">
                  <div className="col-12">
                    <div className="product-field-prodform">
                      <label htmlFor="name">
                        Product Name
                        <span className="product-required-prodform">*</span>
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Classic Running Shoes"
                        maxLength={150}
                        autoComplete="off"
                        required
                      />

                      <small>
                        Use a clear, descriptive name customers can
                        easily recognize.
                      </small>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="product-field-prodform">
                      <label htmlFor="description">
                        Product Description
                        <span className="product-optional-prodform">
                          Optional
                        </span>
                      </label>

                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        maxLength={10000}
                        placeholder="Describe the product, its features, specifications and benefits..."
                      />

                      <small>
                        Include the important details customers need
                        before purchasing.
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="price">
                        Selling Price (PKR)
                        <span className="product-required-prodform">*</span>
                      </label>

                      <div className="product-input-icon-wrap-prodform">
                        <CircleDollarSign
                          size={18}
                          aria-hidden="true"
                        />

                        <input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="2,500.00"
                          required
                        />
                      </div>

                      <small>
                        The price customers pay for this product.
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="compare_at_price">
                        Original Price (PKR)
                        <span className="product-optional-prodform">
                          Optional
                        </span>
                      </label>

                      <div className="product-input-icon-wrap-prodform">
                        <CircleDollarSign
                          size={18}
                          aria-hidden="true"
                        />

                        <input
                          id="compare_at_price"
                          name="compare_at_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="3,000.00"
                        />
                      </div>

                      <small>
                        Previous price for displaying a discount.
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="stock">
                        Available Stock
                        <span className="product-required-prodform">*</span>
                      </label>

                      <div className="product-input-icon-wrap-prodform">
                        <Boxes size={18} aria-hidden="true" />

                        <input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue="0"
                          required
                        />
                      </div>

                      <small>
                        Number of units currently available.
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="category_id">
                        Product Category
                        <span className="product-optional-prodform">
                          Optional
                        </span>
                      </label>

                      <div className="product-select-wrap-prodform">
                        <Layers3 size={18} aria-hidden="true" />

                        <select
                          id="category_id"
                          name="category_id"
                          defaultValue=""
                        >
                          <option value="">Uncategorized</option>

                          {activeCategories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <small>
                        {activeCategories.length === 0
                          ? "No active categories available. You can add a category later."
                          : "Choose the category that best fits this product."}
                      </small>
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Image */}
              <section className="product-form-card-prodform">
                <div className="product-form-card-heading-prodform">
                  <div className="product-form-section-icon-prodform product-form-section-icon-purple-prodform">
                    <ImagePlus size={20} aria-hidden="true" />
                  </div>

                  <div>
                    <h2>Product Image</h2>
                    <p>
                      Add a clear, high-quality image for your product.
                    </p>
                  </div>
                </div>

                <div className="product-upload-box-prodform">
                  <div className="product-upload-icon-prodform">
                    <ImagePlus size={25} aria-hidden="true" />
                  </div>

                  <div className="product-upload-content-prodform">
                    <label htmlFor="image">
                      Main Product Image
                      <span className="product-required-prodform">*</span>
                    </label>

                    <p>
                      Choose a JPG, PNG or WebP image, up to 5 MB.
                    </p>

                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      required
                    />
                  </div>
                </div>

                <div className="product-upload-note-prodform">
                  Use a well-lit image with a clean background for
                  the best presentation in your store.
                </div>
              </section>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="col-12 col-xl-4">
            <aside className="product-form-sidebar-prodform">
              <section className="product-form-card-prodform product-visibility-card-prodform">
                <div className="product-form-card-heading-prodform">
                  <div className="product-form-section-icon-prodform product-form-section-icon-green-prodform">
                    <SlidersHorizontal
                      size={20}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2>Product Visibility</h2>
                    <p>
                      Control how this product appears in your store.
                    </p>
                  </div>
                </div>

                <div className="product-settings-list-prodform">
                  <label className="product-setting-row-prodform">
                    <span className="product-setting-copy-prodform">
                      <strong>Featured Product</strong>
                      <small>
                        Highlight this item in featured sections.
                      </small>
                    </span>

                    <input
                      type="checkbox"
                      name="is_featured"
                      className="product-toggle-prodform"
                    />

                    <span
                      className="product-toggle-track-prodform"
                      aria-hidden="true"
                    />
                  </label>

                  <label className="product-setting-row-prodform">
                    <span className="product-setting-copy-prodform">
                      <strong>Active Product</strong>
                      <small>
                        Make this product visible to customers.
                      </small>
                    </span>

                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked
                      className="product-toggle-prodform"
                    />

                    <span
                      className="product-toggle-track-prodform"
                      aria-hidden="true"
                    />
                  </label>
                </div>
              </section>

              <section className="product-form-guidance-prodform">
                <div className="product-guidance-icon-prodform">
                  <PackagePlus size={19} aria-hidden="true" />
                </div>

                <h3>Before you publish</h3>

                <p>
                  Double-check the selling price, stock quantity and
                  product image before saving your changes.
                </p>

                <ul>
                  <li>Enter accurate product details.</li>
                  <li>Verify your pricing and inventory.</li>
                  <li>Choose the correct visibility settings.</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>

        {/* Form Actions */}
        <div className="product-form-footer-prodform">
          <div className="product-form-footer-copy-prodform">
            <strong>Ready to add your product?</strong>
            <span>
              Review the information before saving.
            </span>
          </div>

          <div className="product-form-actions-prodform">
            <Link
              href="/admin/products"
              className="product-cancel-btn-prodform"
            >
              Cancel
            </Link>

            <SaveButton />
          </div>
        </div>
      </form>
    </main>
  );
}
