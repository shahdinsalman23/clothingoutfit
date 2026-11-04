"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  CreditCard,
  StickyNote,
  Banknote,
  Landmark,
  Loader2,
  Lock,
  AlertCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { placeOrder } from "@/app/actions/checkout";
import OrderSummary from "./OrderSummary";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar",
  "Quetta", "Hyderabad", "Sialkot", "Gujranwala", "Bahawalpur", "Sargodha", "Sukkur",
];

const money = (value) => `Rs. ${Number(value).toLocaleString("en-PK")}`;

function Field({ label, name, error, hint, children }) {
  return (
    <div className={`shopmate-field-chkad ${error ? "invalid-chkad" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error ? <small className="err-chkad">{error}</small> : hint && <small>{hint}</small>}
    </div>
  );
}

export default function CheckoutForm({ items, subtotal, shipping, freeMin, defaults }) {
  const [state, formAction, isPending] = useActionState(placeOrder, null);
  const errors = state?.errors || {};
  const v = (key) => state?.values?.[key] ?? defaults[key] ?? "";
  const total = subtotal + shipping;

  return (
    <form id="shopmate-checkout-form" action={formAction} className="shopmate-grid-chkad">
      <div className="shopmate-main-chkad">
        {state?.message && (
          <div className="shopmate-alert-chkad" role="alert">
            <AlertCircle size={18} />
            <span>{state.message}</span>
          </div>
        )}

        {/* 1. Contact */}
        <section className="shopmate-card-chkad">
          <header>
            <span className="num-chkad">1</span>
            <div>
              <h2>Contact details</h2>
              <p>We will use these to confirm and deliver your order.</p>
            </div>
            <User size={20} className="icon-chkad" />
          </header>

          <div className="shopmate-fields-chkad">
            <Field label="Full name" name="full_name" error={errors.full_name}>
              <input id="full_name" name="full_name" defaultValue={v("full_name")} placeholder="e.g. Shahdin Salman" autoComplete="name" required />
            </Field>
            <Field label="Mobile number" name="phone" error={errors.phone} hint="Our rider will call this number.">
              <input id="phone" name="phone" type="tel" defaultValue={v("phone")} placeholder="0300 1234567" autoComplete="tel" required />
            </Field>
            <Field label="Email address" name="email" error={errors.email}>
              <input id="email" name="email" type="email" defaultValue={v("email")} placeholder="name@example.com" autoComplete="email" required className="full-chkad" />
            </Field>
          </div>
        </section>

        {/* 2. Shipping */}
        <section className="shopmate-card-chkad">
          <header>
            <span className="num-chkad">2</span>
            <div>
              <h2>Delivery address</h2>
              <p>Where should we send your order?</p>
            </div>
            <MapPin size={20} className="icon-chkad" />
          </header>

          <div className="shopmate-fields-chkad">
            <Field label="City" name="city" error={errors.city}>
              <input id="city" name="city" list="shopmate-cities" defaultValue={v("city")} placeholder="Select or type your city" autoComplete="address-level2" required />
              <datalist id="shopmate-cities">
                {CITIES.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </Field>
            <Field label="Postal code (optional)" name="postal_code" error={errors.postal_code}>
              <input id="postal_code" name="postal_code" inputMode="numeric" defaultValue={v("postal_code")} placeholder="e.g. 75400" autoComplete="postal-code" />
            </Field>
            <Field label="Complete address" name="address" error={errors.address} hint="House or flat number, street, area and a nearby landmark.">
              <textarea id="address" name="address" rows={3} defaultValue={v("address")} placeholder="House #12, Street 4, Block 6, near ..." autoComplete="street-address" required className="full-chkad" />
            </Field>
          </div>
        </section>

        {/* 3. Payment */}
        <section className="shopmate-card-chkad">
          <header>
            <span className="num-chkad">3</span>
            <div>
              <h2>Payment method</h2>
              <p>Pay when your order arrives at your door.</p>
            </div>
            <CreditCard size={20} className="icon-chkad" />
          </header>

          <div className="shopmate-pay-chkad">
            <label className="option-chkad selected-chkad">
              <input type="radio" name="payment_method" value="cod" defaultChecked />
              <span className="pay-icon-chkad"><Banknote size={20} /></span>
              <div>
                <strong>Cash on Delivery</strong>
                <small>Pay in cash when you receive your order.</small>
              </div>
              <span className="tick-chkad"><Check size={14} /></span>
            </label>

            <label className="option-chkad disabled-chkad">
              <input type="radio" name="payment_method" value="card" disabled />
              <span className="pay-icon-chkad"><CreditCard size={20} /></span>
              <div>
                <strong>Debit / Credit Card</strong>
                <small>Online card payments</small>
              </div>
              <em>Coming soon</em>
            </label>

            <label className="option-chkad disabled-chkad">
              <input type="radio" name="payment_method" value="bank" disabled />
              <span className="pay-icon-chkad"><Landmark size={20} /></span>
              <div>
                <strong>Bank Transfer</strong>
                <small>Easypaisa, JazzCash or bank</small>
              </div>
              <em>Coming soon</em>
            </label>
          </div>
          {errors.payment_method && <small className="err-chkad">{errors.payment_method}</small>}
        </section>

        {/* 4. Notes */}
        <section className="shopmate-card-chkad">
          <header>
            <span className="num-chkad">4</span>
            <div>
              <h2>Order notes</h2>
              <p>Optional. Delivery timing, gate instructions and so on.</p>
            </div>
            <StickyNote size={20} className="icon-chkad" />
          </header>
          <Field label="Notes" name="notes" error={errors.notes}>
            <textarea id="notes" name="notes" rows={3} maxLength={500} defaultValue={v("notes")} placeholder="Anything we should know?" />
          </Field>
        </section>

        <Link href="/cart" className="shopmate-back-chkad">
          <ArrowLeft size={15} /> Back to cart
        </Link>
      </div>

      <OrderSummary items={items} subtotal={subtotal} shipping={shipping} freeMin={freeMin}>
        <button type="submit" className="shopmate-place-chkad" disabled={isPending}>
          {isPending ? <Loader2 size={18} className="spin-chkad" /> : <Lock size={17} />}
          {isPending ? "Placing your order..." : `Place order · ${money(total)}`}
        </button>
      </OrderSummary>

      <div className="shopmate-mobilebar-chkad">
        <div>
          <small>Total</small>
          <strong>{money(total)}</strong>
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? <Loader2 size={17} className="spin-chkad" /> : <Lock size={16} />}
          {isPending ? "Placing..." : "Place order"}
        </button>
      </div>
    </form>
  );
}