import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { updateCategory } from "@/app/actions/categories";
import { ArrowLeft, FolderPen, Save, X, Info } from "lucide-react";
import { SaveButton, SavingOverlay } from "@/components/admin/ProductFormStatus";
export default async function EditCategoryPage({ params, searchParams }) {
  const { supabase } = await requireAdmin();

  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  const resolvedSearchParams = await searchParams;

  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();

  if (error || !category) {
    throw new Error(`Category not found: ${error?.message || ""}`);
  }

  return (
    <main className="container-fluid py-4 edit-category-page">
      <div className="row">
        <div className="col-12">
          <Link
            href="/admin/categories"
            className="edit-category-back"
          >
            <ArrowLeft size={17} />
            <span>Back to Categories</span>
          </Link>

          <div className="edit-category-heading">
            <div className="edit-category-heading-icon">
              <FolderPen size={25} />
            </div>

            <div>
              <h1>Edit Category</h1>
              <p>
                Update your category details and manage its visibility
                in your Clothing Outfits store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {resolvedSearchParams?.error && (
        <div className="edit-category-alert" role="alert">
          <Info size={19} />
          <span>{resolvedSearchParams.error}</span>
        </div>
      )}

      <div className="row">
        <div className="col-12 col-lg-9 col-xl-7 col-xxl-6">
          <section className="edit-category-card">
            <div className="edit-category-card-header">
              <div>
                <h2>Category Information</h2>
                <p>Make the necessary changes below.</p>
              </div>

              <span className="edit-category-badge">
                Editing
              </span>
            </div>

            <form action={updateCategory}>
              <SavingOverlay title="Updating your category" text="Saving your changes. Please do not close this page." />
              <div className="edit-category-card-body">
                <input
                  type="hidden"
                  name="category_id"
                  value={category.id}
                />

                <div className="edit-category-field">
                  <label htmlFor="name">
                    Category Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={category.name}
                    placeholder="e.g. Electronics"
                    maxLength={100}
                    required
                  />

                  <small>
                    Choose a clear name customers can easily understand.
                  </small>
                </div>

                <div className="edit-category-field">
                  <label htmlFor="description">
                    Description <span className="optional">(Optional)</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    defaultValue={category.description || ""}
                    placeholder="Describe the products in this category..."
                    rows={5}
                    maxLength={500}
                  />

                  <small>
                    Provide a short description, up to 500 characters.
                  </small>
                </div>

                <div className="edit-category-status">
                  <div className="edit-category-status-info">
                    <div className="edit-category-status-icon">
                      <Info size={19} />
                    </div>

                    <div>
                      <h3>Category Status</h3>
                      <p>
                        Control whether this category is available
                        on your storefront.
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="is_active"
                    className="edit-category-toggle"
                  >
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      defaultChecked={category.is_active}
                    />

                    <span className="edit-category-toggle-track" />

                    <span className="edit-category-toggle-label">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="edit-category-card-footer">
                <Link
                  href="/admin/categories"
                  className="edit-category-cancel"
                >
                  <X size={17} />
                  Cancel
                </Link>

                <SaveButton
  label="Update Category"
  pendingLabel="Updating..."
  className="edit-category-submit"
/>
              </div>
            </form>
          </section>

          <p className="edit-category-footnote">
            Changes will be submitted to your Clothing Outfits category record.
          </p>
        </div>
      </div>
    </main>
  );
}