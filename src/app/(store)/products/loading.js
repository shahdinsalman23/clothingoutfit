export default function ProductsLoading() {
  return (
    <div className="shopmate-shop-shopad" aria-busy="true">
      <div className="shopmate-wrap-homad">
        <div className="shopmate-skel-hero-shopad skel-shopad" />
        <div className="shopmate-layout-shopad">
          <div className="shopmate-skel-side-shopad skel-shopad" />
          <div className="shopmate-skel-grid-shopad">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shopmate-skel-card-shopad">
                <div className="skel-shopad shopmate-skel-img-shopad" />
                <div className="skel-shopad shopmate-skel-line-shopad" />
                <div className="skel-shopad shopmate-skel-line-shopad short-shopad" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}