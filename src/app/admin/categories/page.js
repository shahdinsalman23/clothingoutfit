import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import CategoryActions from "./CategoryActions";
import { Plus, FolderTree, CheckCircle2, AlertCircle, Layers } from "lucide-react";
import SuccessPopup from "@/components/admin/SuccessPopup";
export default async function AdminCategoriesPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to load categories: ${error.message}`);
  }

  const allCategories = categories || [];
  const totalCategories = allCategories.length;
  const activeCount = allCategories.filter((c) => c.is_active).length;
  const hiddenCount = allCategories.filter((c) => !c.is_active).length;

  return (
    <div className="shopmate-inv-wrapper-catead container-fluid px-0">

      {/* Top Header Row */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12 col-md-8">
          <span className="shopmate-inv-eyebrow-catead">CATEGORY MANAGEMENT</span>
          <h1 className="shopmate-inv-title-catead">Categories</h1>
          <p className="shopmate-inv-subtitle-catead mb-0">
            Manage your store categories, organization, and visibility seamlessly.
          </p>
        </div>

        <div className="col-12 col-md-auto">
          <Link className="shopmate-inv-primary-btn-catead" href="/admin/categories/new">
            <Plus size={18} className="me-2" />
            Add New Category
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      <SuccessPopup type={params?.success} entity="category" />

      {/* Error Notification Banner */}
      {params?.error && (
        <div className="shopmate-inv-notice-catead shopmate-inv-error-notice-catead mb-4" role="alert">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{params.error}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-catead">
            <div className="shopmate-stat-icon-wrap-catead shopmate-icon-primary-catead">
              <FolderTree size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-catead">Total Categories</span>
              <strong className="shopmate-stat-value-catead">{totalCategories}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-catead">
            <div className="shopmate-stat-icon-wrap-catead shopmate-icon-success-catead">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-catead">Active Categories</span>
              <strong className="shopmate-stat-value-catead">{activeCount}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-catead">
            <div className="shopmate-stat-icon-wrap-catead shopmate-icon-warning-catead">
              <Layers size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-catead">Hidden Categories</span>
              <strong className="shopmate-stat-value-catead">{hiddenCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="shopmate-table-card-catead">
        <div className="shopmate-table-header-catead">
          <div>
            <h2 className="shopmate-table-title-catead">Categories Directory</h2>
            <p className="shopmate-table-desc-catead mb-0">Complete list of store product categories.</p>
          </div>
          <span className="shopmate-table-badge-catead">{totalCategories} items</span>
        </div>

        {allCategories.length === 0 ? (
          <div className="shopmate-empty-box-catead">
            <div className="shopmate-empty-icon-wrap-catead">
              <FolderTree size={40} />
            </div>
            <h3>No categories found</h3>
            <p>Create your first category to start organizing your products.</p>
            <Link className="shopmate-inv-primary-btn-catead" href="/admin/categories/new">
              <Plus size={18} className="me-2" />
              Add Your First Category
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table shopmate-custom-table-catead align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="ps-4">
                      <div className="shopmate-prod-name-cell-catead">
                        <strong>{category.name}</strong>
                      </div>
                    </td>

                    <td>
                      <code className="text-muted fs-8-catead bg-light px-2 py-1 rounded">/{category.slug}</code>
                    </td>

                    <td>
                      <span className="text-muted text-truncate d-inline-block" style={{ maxWidth: "250px" }}>
                        {category.description || "No description provided"}
                      </span>
                    </td>

                    <td>
                      <span className={`shopmate-badge-catead ${category.is_active ? "badge-active-catead" : "badge-inactive-catead"}`}>
                        {category.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="text-end pe-4">
                      <div className="shopmate-action-buttons-catead justify-content-end">
                        <CategoryActions categoryId={category.id} categoryName={category.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}