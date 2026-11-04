import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  PackageCheck,
  ImagePlus,
  SlidersHorizontal,
  AlertCircle,
  Layers3,
  CircleDollarSign,
  Boxes,
  ExternalLink,
  Info,
} from "lucide-react";

import { SaveButton, SavingOverlay } from "@/components/admin/ProductFormStatus";
import { requireAdmin } from "@/lib/admin";
import { updateProduct } from "@/app/actions/products";
import "../../new/product-form.css";

export default async function EditProductPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await requireAdmin();

  const [
    { data: product, error: productError },
    { data: categories, error: categoryError },
    { data: images, error: imageError },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").eq("is_active", true).order("name"),
    supabase
      .from("product_images")
      .select("image_url, alt_text")
      .eq("product_id", id)
      .order("sort_order", { ascending: true })
      .limit(1),
  ]);

  if (productError || categoryError || imageError) {
    throw new Error("Unable to load product details.");
  }

  if (!product) notFound();

  const activeCategories = categories || [];
  const currentImage = images?.[0];
  const createdOn = product.created_at
    ? new Date(product.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <main className="product-form-page-prodform container">
      {/* Page Header */}
      <div className="product-form-header-prodform row">
        <div className="col-12 col-lg-8">
          <Link href="/admin/products" className="product-back-link-prodform">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Products</span>
          </Link>

          <div className="product-form-heading-prodform">
            <span className="product-form-eyebrow-prodform">INVENTORY MANAGEMENT</span>
            <h1>Edit Product</h1>
            <p>
              Update pricing, inventory, product imagery and visibility for
              this item. Changes go live in your store as soon as you save.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="product-form-header-card-prodform">
            <div className="product-form-header-icon-prodform">
              <PackageCheck size={23} aria-hidden="true" />
            </div>
            <div>
              <strong>Editing product</strong>
              <span>{product.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {query?.error && (
        <div className="product-form-notice-prodform" role="alert">
          <div className="product-form-notice-icon-prodform">
            <AlertCircle size={19} aria-hidden="true" />
          </div>
          <div>
            <strong>Unable to update product</strong>
            <p>{query.error}</p>
          </div>
        </div>
      )}

      <form action={updateProduct} className="product-form-prodform">
        <SavingOverlay
          title="Updating your product"
          text="Saving changes and uploading image if you replaced it."
        />
        <input type="hidden" name="product_id" value={product.id} />

        <div className="product-form-layout-prodform row">
          {/* Main Form Column */}
          <div className="col-12 col-xl-8">
            <div className="product-form-main-prodform">
              {/* Product Information */}
              <section className="product-form-card-prodform">
                <div className="product-form-card-heading-prodform">
                  <div className="product-form-section-icon-prodform product-form-section-icon-blue-prodform">
                    <PackageCheck size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h2>Product Information</h2>
                    <p>Update the essential details of your product.</p>
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
                        defaultValue={product.name}
                        placeholder="e.g. Classic Running Shoes"
                        maxLength={150}
                        autoComplete="off"
                        required
                      />
                      <small>Use a clear, descriptive name customers can easily recognize.</small>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="product-field-prodform">
                      <label htmlFor="description">
                        Product Description
                        <span className="product-optional-prodform">Optional</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        maxLength={10000}
                        defaultValue={product.description || ""}
                        placeholder="Describe the product, its features, specifications and benefits..."
                      />
                      <small>Include the important details customers need before purchasing.</small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="price">
                        Selling Price (PKR)
                        <span className="product-required-prodform">*</span>
                      </label>
                      <div className="product-input-icon-wrap-prodform">
                        <CircleDollarSign size={18} aria-hidden="true" />
                        <input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={product.price}
                          placeholder="2,500.00"
                          required
                        />
                      </div>
                      <small>The price customers pay for this product.</small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="compare_at_price">
                        Original Price (PKR)
                        <span className="product-optional-prodform">Optional</span>
                      </label>
                      <div className="product-input-icon-wrap-prodform">
                        <CircleDollarSign size={18} aria-hidden="true" />
                        <input
                          id="compare_at_price"
                          name="compare_at_price"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={product.compare_at_price ?? ""}
                          placeholder="3,000.00"
                        />
                      </div>
                      <small>Previous price for displaying a discount.</small>
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
                          defaultValue={product.stock}
                          required
                        />
                      </div>
                      <small>Number of units currently available.</small>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="product-field-prodform">
                      <label htmlFor="category_id">
                        Product Category
                        <span className="product-optional-prodform">Optional</span>
                      </label>
                      <div className="product-select-wrap-prodform">
                        <Layers3 size={18} aria-hidden="true" />
                        <select
                          id="category_id"
                          name="category_id"
                          defaultValue={product.category_id || ""}
                        >
                          <option value="">Uncategorized</option>
                          {activeCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <small>Choose the category that best fits this product.</small>
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
                    <p>Manage the image displayed on your storefront.</p>
                  </div>
                </div>

                {currentImage?.image_url && (
                  <div className="current-image-epimg">
                    <div className="thumb-epimg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentImage.image_url}
                        alt={currentImage.alt_text || product.name}
                      />
                    </div>
                    <div>
                      <span className="tag-epimg">
                        <i /> Current image
                      </span>
                      <strong>{product.name}</strong>
                      <p>Upload a replacement below only if you want to change this image.</p>
                    </div>
                  </div>
                )}

                <div className="product-upload-box-prodform">
                  <div className="product-upload-icon-prodform">
                    <ImagePlus size={25} aria-hidden="true" />
                  </div>

                  <div className="product-upload-content-prodform">
                    <label htmlFor="image">
                      {currentImage?.image_url ? "Replace Product Image" : "Main Product Image"}
                      <span className="product-optional-prodform">Optional</span>
                    </label>
                    <p>Choose a JPG, PNG or WebP image, up to 5 MB.</p>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </div>
                </div>

                <div className="product-upload-note-prodform">
                  Use a well-lit image with a clean background for the best
                  presentation in your store.
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
                    <SlidersHorizontal size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h2>Product Visibility</h2>
                    <p>Control how this product appears in your store.</p>
                  </div>
                </div>

                <div className="product-settings-list-prodform">
                  <label className="product-setting-row-prodform">
                    <span className="product-setting-copy-prodform">
                      <strong>Featured Product</strong>
                      <small>Highlight this item in featured sections.</small>
                    </span>
                    <input
                      type="checkbox"
                      name="is_featured"
                      defaultChecked={product.is_featured}
                      className="product-toggle-prodform"
                    />
                    <span className="product-toggle-track-prodform" aria-hidden="true" />
                  </label>

                  <label className="product-setting-row-prodform">
                    <span className="product-setting-copy-prodform">
                      <strong>Active Product</strong>
                      <small>Make this product visible to customers.</small>
                    </span>
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={product.is_active}
                      className="product-toggle-prodform"
                    />
                    <span className="product-toggle-track-prodform" aria-hidden="true" />
                  </label>
                </div>
              </section>

              <section className="product-form-guidance-prodform">
                <div className="product-guidance-icon-prodform">
                  <Info size={19} aria-hidden="true" />
                </div>

                <h3>Product snapshot</h3>

                <dl className="snapshot-epimg">
                  <div>
                    <dt>Slug</dt>
                    <dd>/{product.slug}</dd>
                  </div>
                  <div>
                    <dt>Product code</dt>
                    <dd className="font-monospace">#{String(product.id).slice(0, 8)}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{createdOn}</dd>
                  </div>
                </dl>

                {product.slug && (
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="store-link-epimg"
                  >
                    View in store <ExternalLink size={14} aria-hidden="true" />
                  </Link>
                )}
              </section>
            </aside>
          </div>
        </div>

        {/* Form Actions */}
        <div className="product-form-footer-prodform">
          <div className="product-form-footer-copy-prodform">
            <strong>Ready to save your changes?</strong>
            <span>Review the information before saving.</span>
          </div>

          <div className="product-form-actions-prodform">
            <Link href="/admin/products" className="product-cancel-btn-prodform">
              Cancel
            </Link>

            <SaveButton label="Save Changes" pendingLabel="Updating..." />
          </div>
        </div>
      </form>
    </main>
  );
}