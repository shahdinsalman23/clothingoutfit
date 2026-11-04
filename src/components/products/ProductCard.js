import Link from "next/link";
import { ImageOff } from "lucide-react";

export default function ProductCard({ product }) {
  const stock = Number(product.stock || 0);
  const soldOut = stock <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="shopmate-card-pcdad">
      <div className="shopmate-media-pcdad">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <span className="shopmate-noimg-pcdad">
            <ImageOff size={28} />
          </span>
        )}

        <div className="shopmate-badges-pcdad">
          {product.is_featured && <span className="featured-pcdad">Featured</span>}
          {soldOut && <span className="sold-pcdad">Sold out</span>}
          {!soldOut && stock < 10 && <span className="low-pcdad">Only {stock} left</span>}
        </div>
      </div>

      <div className="shopmate-body-pcdad">
        <h3>{product.name}</h3>
        <div className="shopmate-price-row-pcdad">
          <strong>Rs. {Number(product.price).toLocaleString("en-PK")}</strong>
          <span>View details</span>
        </div>
      </div>
    </Link>
  );
}