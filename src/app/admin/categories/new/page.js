
import Link from "next/link";
import {
  ArrowLeft,
  Layers3,
  FolderPlus,
  FileText,
  CheckCircle2,
  Save,
  AlertCircle,
  Tag,
} from "lucide-react";
import { SaveButton, SavingOverlay } from "@/components/admin/ProductFormStatus";
import { requireAdmin } from "@/lib/admin";
import { createCategory } from "@/app/actions/categories";

export default async function NewCategoryPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;

  return (
    <main className="category-form-page-catform container">
      {/* Page Header */}
      <div className="category-form-header-catform row">
        <div className="col-12 col-lg-8">
          <Link
            href="/admin/categories"
            className="category-back-link-catform"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Categories</span>
          </Link>

          <div className="category-form-heading-catform">
            <span className="category-form-eyebrow-catform">
              CATALOG MANAGEMENT
            </span>

            <h1>Add New Category</h1>

            <p>
              Organize your Clothing Outfits catalog by creating a new
              category for your products. Add a clear name,
              description and visibility settings.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="category-header-card-catform">
            <div className="category-header-icon-catform">
              <FolderPlus size={23} aria-hidden="true" />
            </div>

            <div>
              <strong>New Category</strong>
              <span>Catalog organization and settings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {params?.error && (
        <div
          className="category-form-notice-catform"
          role="alert"
        >
          <div className="category-notice-icon-catform">
            <AlertCircle size={19} aria-hidden="true" />
          </div>

          <div>
            <strong>Unable to create category</strong>
            <p>{params.error}</p>
          </div>
        </div>
      )}

      <form
        action={createCategory}
        className="category-form-catform"
      >
         <SavingOverlay title="Creating your category" text="Saving category details. Please do not close this page." />
        <div className="category-form-layout-catform row">
          {/* Main Form */}
          <div className="col-12 col-xl-8">
            <div className="category-form-main-catform">
              <section className="category-form-card-catform">
                <div className="category-card-heading-catform">
                  <div className="category-section-icon-catform category-icon-blue-catform">
                    <Layers3 size={20} aria-hidden="true" />
                  </div>

                  <div>
                    <h2>Category Information</h2>
                    <p>
                      Define the identity and purpose of this category.
                    </p>
                  </div>
                </div>

                <div className="category-form-fields-catform row">
                  <div className="col-12">
                    <div className="category-field-catform">
                      <label htmlFor="name">
                        Category Name
                        <span className="category-required-catform">
                          *
                        </span>
                      </label>

                      <div className="category-input-wrap-catform">
                        <Tag size={18} aria-hidden="true" />

                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="e.g. Footwear, Electronics"
                          maxLength={100}
                          autoComplete="off"
                          required
                        />
                      </div>

                      <small>
                        Choose a short, recognizable name that
                        describes the products in this category.
                      </small>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="category-field-catform">
                      <label htmlFor="description">
                        Category Description
                        <span className="category-optional-catform">
                          Optional
                        </span>
                      </label>

                      <div className="category-textarea-wrap-catform">
                        <FileText size={18} aria-hidden="true" />

                        <textarea
                          id="description"
                          name="description"
                          rows={5}
                          maxLength={500}
                          placeholder="Describe what products belong to this category..."
                        />
                      </div>

                      <small>
                        Explain which products belong here to help
                        maintain an organized store catalog.
                      </small>
                    </div>
                  </div>
                </div>
              </section>

              {/* Category Visibility */}
              <section className="category-form-card-catform">
                <div className="category-card-heading-catform">
                  <div className="category-section-icon-catform category-icon-green-catform">
                    <CheckCircle2 size={20} aria-hidden="true" />
                  </div>

                  <div>
                    <h2>Category Visibility</h2>
                    <p>
                      Choose whether this category should be active
                      in your store.
                    </p>
                  </div>
                </div>

                <label className="category-setting-row-catform">
                  <span className="category-setting-icon-catform">
                    <Layers3 size={19} aria-hidden="true" />
                  </span>

                  <span className="category-setting-copy-catform">
                    <strong>Active Category</strong>
                    <small>
                      Make this category available for display in
                      your store, according to your store logic.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked
                    className="category-toggle-catform"
                  />

                  <span
                    className="category-toggle-track-catform"
                    aria-hidden="true"
                  />
                </label>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-xl-4">
            <aside className="category-form-sidebar-catform">
              <section className="category-preview-card-catform">
                <div className="category-preview-top-catform">
                  <div className="category-preview-icon-catform">
                    <Layers3 size={24} aria-hidden="true" />
                  </div>

                  <span className="category-preview-label-catform">
                    CATEGORY
                  </span>
                </div>

                <h3>Organized Catalog</h3>

                <p>
                  A clear category structure makes your store easier
                  to browse and helps keep products organized.
                </p>

                <div className="category-preview-divider-catform" />

                <div className="category-preview-benefit-catform">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>Better product organization</span>
                </div>

                <div className="category-preview-benefit-catform">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>Clearer catalog structure</span>
                </div>

                <div className="category-preview-benefit-catform">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>Easier category management</span>
                </div>
              </section>

              <section className="category-guidance-card-catform">
                <div className="category-guidance-icon-catform">
                  <FileText size={19} aria-hidden="true" />
                </div>

                <h3>Before you save</h3>

                <p>
                  Keep your category names consistent and make sure
                  each category has a clear purpose.
                </p>

                <ul>
                  <li>Use a concise, descriptive name.</li>
                  <li>Avoid duplicate category names.</li>
                  <li>Review visibility settings before saving.</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>

        {/* Form Footer */}
        <div className="category-form-footer-catform">
          <div className="category-footer-copy-catform">
            <strong>Ready to create your category?</strong>
            <span>
              Review your information before submitting.
            </span>
          </div>

          <div className="category-form-actions-catform">
            <Link
              href="/admin/categories"
              className="category-cancel-btn-catform"
            >
              Cancel
            </Link>

           <SaveButton
              label="Save Category"
              pendingLabel="Saving..."
              className="category-submit-btn-catform"
            />
          </div>
        </div>
      </form>
    </main>
  );
}
