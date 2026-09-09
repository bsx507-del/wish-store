"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; price: number; emoji: string; tag?: string; description: string };
type User = { email: string; joinedAt: string };

const products: Product[] = [
  { id: 1, name: "رسالة طمأنينة", category: "لحظات", price: 199, emoji: "💌", tag: "الأكثر طلبًا", description: "كلمات مصممة ترفع معنوياتك الآن" },
  { id: 2, name: "مزاج القهوة", category: "مزاج", price: 299, emoji: "☕", description: "طقس صباحي رقمي مع موسيقى هادئة" },
  { id: 3, name: "تذكرة هروب", category: "تجارب", price: 499, emoji: "🎟️", tag: "جديد", description: "ثلاث دقائق من السفر بخيالك" },
  { id: 4, name: "باقة امتنان", category: "هدايا", price: 799, emoji: "💐", description: "هدية رقمية ترسلها لمن تحب" },
  { id: 5, name: "جلسة فضفضة", category: "لحظات", price: 599, emoji: "🫶", description: "مساحة خاصة لترتب أفكارك" },
  { id: 6, name: "سحابة أمنيات", category: "تجارب", price: 999, emoji: "☁️", description: "اكتب أمنيتك واتركها تطير" },
  { id: 7, name: "تاج اليوم", category: "هدايا", price: 199, emoji: "👑", tag: "خفيف", description: "تذكير لطيف بأنك تستحق الأفضل" },
  { id: 8, name: "موجة هدوء", category: "مزاج", price: 399, emoji: "🌊", description: "صوت قصير يساعدك على التنفس" },
];
const categories = ["الكل", "لحظات", "مزاج", "تجارب", "هدايا"];
const currency = new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 2 });
const halalas = (value: number) => `${value.toLocaleString("ar-SA")} هللة`;

function Icon({ name }: { name: "arrow" | "cart" | "user" | "search" | "close" | "check" }) {
  const paths = {
    arrow: <><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></>,
    cart: <><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3 3-4.5 7-4.5s6.3 1.5 7 4.5" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Home() {
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [reward, setReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState("");

  useEffect(() => {
    const savedCart = window.localStorage.getItem("wish-cart");
    const savedUser = window.localStorage.getItem("wish-user");
    if (savedCart) setCart(JSON.parse(savedCart) as Record<number, number>);
    if (savedUser) setUser(JSON.parse(savedUser) as User);
  }, []);
  useEffect(() => { window.localStorage.setItem("wish-cart", JSON.stringify(cart)); }, [cart]);

  const filtered = useMemo(() => products.filter((p) => (category === "الكل" || p.category === category) && p.name.includes(query)), [category, query]);
  const cartItems = products.filter((p) => cart[p.id]);
  const count = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const total = cartItems.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const add = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  const remove = (id: number) => setCart((current) => { const next = { ...current, [id]: (current[id] || 0) - 1 }; if (next[id] <= 0) delete next[id]; return next; });

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email")?.toString().trim() || "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError("اكتب بريدًا إلكترونيًا صحيحًا مثل name@example.com");
      return;
    }
    const nextUser = { email, joinedAt: new Date().toISOString() };
    setUser(nextUser);
    window.localStorage.setItem("wish-user", JSON.stringify(nextUser));
    setAuthError("");
    setAuthMessage("تم إنشاء حسابك محليًا. ربط البريد الفعلي يحتاج مزود إرسال بريد في مرحلة الإطلاق.");
  };

  const claimReward = () => {
    if (reward) {
      setRewardMessage("استلمت مكافأتك اليوم. ارجع غدًا لمفاجأة جديدة.");
      return;
    }
    setReward(true);
    setRewardMessage("أضفنا ٢٥ هللة رمزية لرصيدك التجريبي.");
  };

  return (
    <main>
      <a className="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
      <header className="topbar shell">
        <a className="brand" href="#" aria-label="وِشّ، الصفحة الرئيسية"><span className="brand-mark">و</span><span>وِشّ</span></a>
        <nav className="nav-links" aria-label="التنقل الرئيسي"><a href="#shop">اكتشف</a><a href="#business">كيف نكسب؟</a><a href="#rewards">المكافآت</a></nav>
        <div className="top-actions">
          <button className="account-button" onClick={() => setAuthOpen(true)}><Icon name="user" />{user ? "حسابي" : "دخول بالبريد"}</button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`فتح السلة، ${count} منتجات`}><Icon name="cart" />{count > 0 && <b className="cart-count">{count}</b>}</button>
        </div>
      </header>

      <div id="main-content" className="shell">
        <section className="hero-modern">
          <div className="hero-copy">
            <span className="eyebrow"><i /> مساحة صغيرة لمزاج أفضل</span>
            <h1>لا تشتري شيئًا.<br /><em>اشترِ إحساسًا.</em></h1>
            <p>وِشّ متجر رقمي للهدايا واللحظات الخفيفة. اختر شيئًا يشبهك، واصنع ذكرى تنحفظ عندك — بلا شحن، بلا تعقيد.</p>
            <div className="hero-actions"><button className="button-primary" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>ابدأ الاستكشاف <Icon name="arrow" /></button><span className="hero-note">منتجات رقمية فقط · تجربة آمنة</span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><div className="art-card"><span>01</span><strong>لحظة<br />لك</strong><small>تستحقها اليوم</small></div><div className="art-chip chip-one">✦ هدية رقمية</div><div className="art-chip chip-two">مزاج ↑</div></div>
        </section>

        <section className="proof-strip" aria-label="معلومات الثقة"><div><strong>100%</strong><span>رقمي وفوري</span></div><div><strong>0</strong><span>بيانات بطاقة</span></div><div><strong>25 هللة</strong><span>مكافأة يومية</span></div><div><strong>∞</strong><span>أمنيات ممكنة</span></div></section>

        <section id="shop" className="shop-section">
          <div className="section-heading"><div><span className="section-kicker">المتجر</span><h2>شيء جميل، لك أو لمن تحب</h2><p>منتجات رقمية تُفتح فورًا بعد التجربة.</p></div><label className="search-box"><Icon name="search" /><input aria-label="ابحث في المنتجات" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن أمنية…" /></label></div>
          <div className="filters" aria-label="تصنيف المنتجات">{categories.map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className={`product-visual visual-${product.id}`}><span>{product.emoji}</span>{product.tag && <b>{product.tag}</b>}</div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><strong>{currency.format(product.price / 100)}</strong><button className="add-button" onClick={() => add(product.id)} aria-label={`إضافة ${product.name} إلى السلة`}>+</button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty">لم نجد ما تبحث عنه. جرّب كلمة أخرى…</div>}
        </section>

        <section id="business" className="business-section"><div className="business-heading"><span className="section-kicker">النموذج</span><h2>كيف يتحول وِشّ إلى مشروع؟</h2><p>الفكرة ليست بيع أشياء وهمية فقط؛ بل بيع لحظات رقمية قابلة للتوسع.</p></div><div className="business-grid"><div><span>01</span><h3>منتجات رقمية</h3><p>هامش ربح مرتفع: بطاقات، تجارب صوتية، تحديات ومحتوى يفتح فورًا.</p></div><div><span>02</span><h3>عضوية شهرية</h3><p>باقة شهرية للأمنيات الجديدة والمحتوى الحصري لمن يحب التجربة.</p></div><div><span>03</span><h3>هدايا للأصدقاء</h3><p>شارك رابط أمنية كهدية، مع فرصة لاحقة للتعاون مع علامات تجارية.</p></div></div><div className="payment-plan"><div><span className="plan-dot" /><div><strong>الدفع الحقيقي جاهز للربط</strong><p>سنربط Stripe أو Moyasar عند اختيار مزودك وإضافة مفاتيح الحساب — لا نخزّن بيانات البطاقات هنا.</p></div></div><span className="coming-soon">قريبًا عند الإطلاق</span></div></section>

        <section id="rewards" className="reward-section"><div><span className="section-kicker">ولاء بسيط</span><h2>خذ مكافأتك، بدون إعلانات مزعجة</h2><p>سجّل بالبريد لتحفظ رصيدك وتعود كل يوم لمكافأة رمزية.</p><button className="button-dark" onClick={user ? claimReward : () => setAuthOpen(true)}>{user ? (reward ? "تم استلام مكافأة اليوم" : "استلام ٢٥ هللة") : "أنشئ حسابك بالبريد"} <Icon name="arrow" /></button>{rewardMessage && <p className="reward-message" aria-live="polite">{rewardMessage}</p>}</div><div className="reward-visual" aria-hidden="true"><span>25</span><small>هللة</small><i>✦</i></div></section>
        <footer className="footer"><span>© 2026 وِشّ</span><span>منتجات افتراضية · الدفع الحقيقي يُفعّل عند الإطلاق</span></footer>
      </div>

      {cartOpen && <div className="overlay" role="presentation" onClick={() => setCartOpen(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">مراجعة</span><h2 id="cart-title">سلتك <small>({count})</small></h2></div><button className="icon-close" onClick={() => setCartOpen(false)} aria-label="إغلاق السلة"><Icon name="close" /></button></div>{cartItems.length === 0 ? <div className="empty">السلة فاضية حاليًا.<br />اختر أمنية تعجبك من المتجر.</div> : <>{cartItems.map((product) => <div className="cart-line" key={product.id}><span className="cart-emoji">{product.emoji}</span><div><strong>{product.name}</strong><small>{currency.format(product.price / 100)}</small></div><div className="quantity"><button onClick={() => remove(product.id)} aria-label={`تقليل ${product.name}`}>−</button><b>{cart[product.id]}</b><button onClick={() => add(product.id)} aria-label={`زيادة ${product.name}`}>+</button></div></div>)}<div className="cart-total"><span>الإجمالي</span><strong>{currency.format((total - (reward ? 25 : 0)) / 100)}</strong><small>{halalas(Math.max(0, total - (reward ? 25 : 0)))} · لا يوجد توصيل</small></div><button className="checkout-button" onClick={() => { setCartOpen(false); setAuthOpen(true); setAuthMessage("بعد تسجيل البريد سنجهز لك صفحة الدفع عند تفعيل مزود الدفع."); }}>{user ? "متابعة للدفع عند الإطلاق" : "تسجيل البريد للمتابعة"}</button></>}</aside></div>}

      {authOpen && <div className="modal-wrap" onClick={() => setAuthOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()}><button className="icon-close modal-close" onClick={() => setAuthOpen(false)} aria-label="إغلاق نافذة الحساب"><Icon name="close" /></button><div className="auth-symbol">و</div><span className="section-kicker">حسابك في وِشّ</span><h2 id="auth-title">{user ? "أهلًا بعودتك" : "احفظ أمنياتك في مكان واحد"}</h2><p>{user ? `مسجل بالبريد: ${user.email}` : "استخدم بريدك فقط. لا كلمة مرور، ولا رسائل مزعجة."}</p>{user ? <button className="button-dark full-button" onClick={() => { setUser(null); window.localStorage.removeItem("wish-user"); setAuthOpen(false); }}>تسجيل الخروج</button> : <form onSubmit={signUp}><label htmlFor="email">البريد الإلكتروني</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="name@example.com" required /><button className="button-dark full-button" type="submit">إنشاء حساب بالبريد <Icon name="arrow" /></button>{authError && <p className="form-error" role="alert">{authError}</p>}{authMessage && <p className="form-success" aria-live="polite">{authMessage}</p>}</form>}<small className="auth-footnote"><Icon name="check" /> حساب تجريبي محلي الآن، وجاهز للربط بتسجيل دخول حقيقي عند الإطلاق.</small></section></div>}
    </main>
  );
}
