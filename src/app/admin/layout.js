import { requireAdmin } from "@/lib/admin";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import "@/styles/admin.css";

export default async function AdminLayout({ children }) {
  const { profile } = await requireAdmin();

  return (
    <AdminLayoutClient profile={profile}>
      {children}
    </AdminLayoutClient>
  );
}