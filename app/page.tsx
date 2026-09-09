"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; price: number; emoji: string; tag?: string; description: string };

const products: Product[] = [
  { id: 1, name: "نجمة الحظ", category: "رموز", price: 99, emoji: "🌟", tag: "الأكثر طلبًا", description: "جرعة حظ افتراضية ليومك" },
  { id: 2, name: "قهوة على حسابنا", category: "مزاج", price: 250, emoji: "☕", description: "دفء صغير في شاشة كبيرة" },
  { id: 3, name: "تذكرة للهروب", category: "تجارب", price: 499, emoji: "🎟️", tag: "جديد", description: "رحلة خيالية إلى أي مكان" },
  { id: 4, name: "باقة فرح", category: "هدايا", price: 750, emoji: "💐", description: "ورد لا يذبل أبدًا" },
  { id: 5, name: "بيتزا منتصف الليل", category: "مزاج", price: 350, emoji: "🍕", description: "لأن الجوع لا ينتظر" },
  { id: 6, name: "سحابة أمنيات", category: "رموز", price: 1200, emoji: "☁️", description: "ضع أمنيتك هنا واتركها تطير" },
  { id: 7, name: "تاج اليوم", category: "هدايا", price: 199, emoji: "👑", tag: "خفيف", description: "تستحق أن تكون الملك" },
  { id: 8, name: "موجة هدوء", category: "تجارب", price: 599, emoji: "🌊", description: "دقيقة سلام وسط الزحمة" },
];
const categories = ["الكل", "مزاج", "رموز", "تجارب", "هدايا"];
const money = (halalas: number) => `${halalas.toLocaleString("ar-SA")} هللة`;

export default function Home() {
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [reward, setReward] = useState(0);
  const [rewardMessage, setRewardMessage] = useState("");

  const filtered = useMemo(() => products.filter((p) => (category === "الكل" || p.category === category) && p.name.includes(query)), [category, query]);
  const cartItems = products.filter((p) => cart[p.id]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = cartItems.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  useEffect(() => {
    const saved = window.localStorage.getItem("wish-cart");
    if (saved) setCart(JSON.parse(saved) as Record<number, number>);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("wish-cart", JSON.stringify(cart));
  }, [cart]);
  const add = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id: number) => setCart((c) => { const next = { ...c, [id]: (c[id] || 0) - 1 }; if (next[id] <= 0) delete next[id]; return next; });
  const claimReward = () => {
    if (reward > 0) {
      setRewardMessage("أخذت مكافأتك اليوم — ارجع بكرة لمفاجأة جديدة ✨");
      return;
    }
    setReward(25);
    setRewardMessage("وصلتك ٢٥ هللة رمزية لرصيدك. بدون إعلانات مزعجة 💜");
  };

  return (
    <main>
      <nav className="shell nav">
        <a className="logo" href="#"><span className="logo-mark">✦</span><span>وِشّ</span></a>
        <div className="nav-links"><a href="#catalog">المتجر</a><a href="#how">كيف يعمل؟</a><a href="#rewards">مكافآت وإعلانات</a></div>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="فتح السلة">🛒 <span>سلّتي</span>{count > 0 && <b className="badge">{count}</b>}</button>
      </nav>

      <div className="shell">
        <section className="hero">
          <div className="hero-stickers"><span>✨</span><span>💜</span><span>🪩</span><span>🌈</span></div>
          <div className="hero-content">
            <span className="eyebrow">متجر الأمنيات الصغيرة ✨</span>
            <h1>اشترِ شعورًا<br />بـ هللات بسيطة.</h1>
            <p>وِشّ هو المكان اللي تشتري فيه أشياء ما تحتاجها، بس نفسك فيها. منتجات افتراضية 100%، للمتعة والضحكة فقط.</p>
            <button className="primary" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>تصفّح الأمنيات <span>←</span></button>
          </div>
        </section>

        <section id="catalog">
          <div className="section-head"><div><h2>وش نفسك فيه اليوم؟</h2><p>أمنيات صغيرة، تأثيرها كبير على المزاج.</p></div></div>
          <div className="catalog-tools">
            <div className="filters">{categories.map((c) => <button key={c} className={`filter ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
            <label className="search">⌕<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن أمنية..." /></label>
          </div>
          <div className="products">
            {filtered.map((p) => <article className="product" key={p.id}>
              <div className="product-image"><span>{p.emoji}</span>{p.tag && <b className="new">{p.tag}</b>}</div>
              <h3>{p.name}</h3><small>{p.description}</small>
              <div className="product-foot"><div className="price">{money(p.price)}<span> · {(p.price / 100).toFixed(2)} ر.س</span></div><button className="add" onClick={() => add(p.id)} aria-label={`إضافة ${p.name}`}>+</button></div>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="empty"><div>🔎</div>ما لقينا أمنيتك.. جرّب كلمة ثانية</div>}
        </section>

        <section className="trust" id="how">
          <div className="trust-item"><span className="trust-icon">🎈</span><div><h3>كلها افتراضية</h3><p>لا يوجد شحن أو توصيل. أنت تشتري لحظة، مو منتجًا حقيقيًا.</p></div></div>
          <div className="trust-item"><span className="trust-icon">🔒</span><div><h3>دفع تجريبي وآمن</h3><p>لا نطلب بيانات بطاقتك. هذه تجربة محاكاة للمتعة فقط.</p></div></div>
          <div className="trust-item reward-card" id="rewards"><span className="trust-icon">🎁</span><div><h3>مكافآت بدون إزعاج</h3><p>مكافأة يومية اختيارية بدل الإعلانات المزعجة. لا نطلب تسجيلًا أو بيانات شخصية.</p><button className="reward-button" onClick={claimReward}>{reward > 0 ? "تم استلام المكافأة" : "استلام ٢٥ هللة"}</button>{rewardMessage && <small className="reward-message">{rewardMessage}</small>}</div></div>
        </section>
        <footer className="footer"><span>© 2024 وِشّ — متجر الأمنيات الافتراضي</span><span>للضحكة فقط، لا نبيع أشياء حقيقية 💜</span></footer>
      </div>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head"><h2>سلّتك ({count})</h2><button className="close" onClick={() => setCartOpen(false)}>×</button></div>
        {cartItems.length === 0 ? <div className="empty"><div>🛒</div>السلة فاضية.. أضف أمنية!</div> : <>{cartItems.map((p) => <div className="cart-line" key={p.id}><div className="cart-emoji">{p.emoji}</div><div><h4>{p.name}</h4><p>{money(p.price)}</p></div><div className="qty"><button onClick={() => remove(p.id)}>−</button><b>{cart[p.id]}</b><button onClick={() => add(p.id)}>+</button></div></div>)}
          <div className="cart-summary"><div className="summary-row"><span>المجموع الفرعي</span><span>{money(total)}</span></div><div className="summary-row"><span>التوصيل</span><span>افتراضي ✨</span></div><div className="summary-row total"><span>الإجمالي</span><span>{money(total)}<small> · {(total / 100).toFixed(2)} ر.س</small></span></div><button className="checkout" onClick={() => { setCheckoutOpen(true); setCartOpen(false); }}>إتمام التجربة</button></div>
        </>}
      </aside></div>}

      {checkoutOpen && <div className="modal-wrap"><div className="modal">
        {!complete ? <><div className="drawer-head"><h2>لحظة الدفع ✨</h2><button className="close" onClick={() => setCheckoutOpen(false)}>×</button></div><p>أدخل اسمك فقط لنجهّز لك بطاقة الأمنيات. لا يوجد دفع حقيقي ولا نحتاج أي بيانات حساسة.</p><input className="form-input" placeholder="اسمك الجميل" /><div className="notice">🔔 تذكير لطيف: المنتجات افتراضية بالكامل، ولن يصلك أي شيء بالبريد.</div><button className="checkout" onClick={() => setComplete(true)}>أؤكد التجربة — {money(total)}</button></> :
          <div className="success"><div className="success-icon">🎉</div><h2>تمّت الأمنية!</h2><p>مبروك، صارت عندك لحظة فرح جديدة. شكرًا لأنك لعبت معنا.</p><button className="checkout" onClick={() => { setCheckoutOpen(false); setComplete(false); setCart({}); }}>العودة للمتجر</button></div>}
      </div></div>}
    </main>
  );
}
