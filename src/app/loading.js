export default function Loading() {
  return (
    <div className="shopmate-loader-loadad" role="status" aria-live="polite">
      <span className="shopmate-blob-loadad blob-one-loadad" />
      <span className="shopmate-blob-loadad blob-two-loadad" />

      <div className="shopmate-content-loadad">
        <div className="shopmate-stage-loadad">
          <span className="shopmate-halo-loadad" />
          <span className="shopmate-ring-loadad ring-outer-loadad" />
          <span className="shopmate-ring-loadad ring-inner-loadad" />
          <div className="shopmate-logo-loadad">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logomini.png" alt="ShopMate" style={{ width: "50px", height: "50px", objectFit: "contain" }} 
            />
          </div>
        </div>

        <h2 className="shopmate-brand-loadad">Clothing Outfits</h2>

        <p className="shopmate-text-loadad">
          Preparing your store
          <span className="shopmate-dots-loadad">
            <i />
            <i />
            <i />
          </span>
        </p>

        <div className="shopmate-progress-loadad">
          <span />
        </div>
      </div>

      <span className="visually-hidden">Loading ShopMate</span>
    </div>
  );
}