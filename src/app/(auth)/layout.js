import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="shopmate-shell-shdad">
      <Header />
      <main className="shopmate-main-shdad">{children}</main>
      <Footer />
    </div>
  );
}