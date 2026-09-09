"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; price: number; emoji: string; tag?: string; description: string };
type User = { email: string; joinedAt: string };

const catalogSeed: Array<[string, number, string, string]> = [
  ["برجر مشوي دبل", 18, "🍔", "أكل"], ["بيتزا حارة", 15, "🍕", "أكل"], ["ساندوتش دجاج", 13, "🥪", "أكل"], ["سلطة سيزر", 10, "🥗", "أكل"], ["شوربة عدس", 8, "🍲", "أكل"], ["بيض مقلي", 6, "🍳", "أكل"], ["خبز فرنسي", 5, "🥖", "أكل"], ["جبنة موزاريلا", 9, "🧀", "أكل"], ["لحم مشوي", 22, "🥩", "أكل"], ["سمك مشوي", 20, "🐟", "أكل"], ["تفاح أحمر", 4, "🍎", "أكل"], ["كرز طازج", 7, "🍒", "أكل"], ["جزر طازج", 3, "🥕", "أكل"], ["مشروم مشوي", 6, "🍄", "أكل"], ["فشار بالزبدة", 5, "🍿", "أكل"],
  ["مشروب غازي بارد", 8, "🥤", "مشروبات"], ["قهوة مثلجة كراميل", 12, "🧋", "مشروبات"], ["شاي كرك دافئ", 6, "🍵", "مشروبات"], ["عصير مانجو طازج", 11, "🥭", "مشروبات"], ["عصير برتقال", 9, "🍊", "مشروبات"], ["قهوة إسبريسو", 10, "☕", "مشروبات"], ["حليب بالشوكولاتة", 7, "🥛", "مشروبات"], ["موهيتو منعش", 14, "🍹", "مشروبات"], ["عصير ليمون بالنعناع", 8, "🍋", "مشروبات"], ["ماء فوار", 4, "💧", "مشروبات"],
  ["دونات بالشوكولاتة", 9, "🍩", "حلويات"], ["آيس كريم فراولة", 10, "🍓", "حلويات"], ["كيكة شوكولاتة", 16, "🍰", "حلويات"], ["شوكولاتة فاخرة", 14, "🍫", "حلويات"], ["حلوى ملبس", 6, "🍬", "حلويات"], ["كوكيز بالمكسرات", 8, "🍪", "حلويات"], ["بقلاوة", 12, "🧁", "حلويات"], ["مافن بالتوت", 9, "🫐", "حلويات"],
  ["سماعات لاسلكية", 45, "🎧", "إلكترونيات"], ["ساعة ذكية", 50, "⌚", "إلكترونيات"], ["جوال حديث", 50, "📱", "إلكترونيات"], ["لابتوب رفيع", 50, "💻", "إلكترونيات"], ["كاميرا احترافية", 48, "📷", "إلكترونيات"], ["شاشة تلفزيون", 50, "📺", "إلكترونيات"], ["لوحة مفاتيح", 30, "⌨️", "إلكترونيات"], ["ماوس لاسلكي", 20, "🖱️", "إلكترونيات"], ["طابعة صغيرة", 40, "🖨️", "إلكترونيات"], ["يد تحكم ألعاب", 35, "🎮", "إلكترونيات"], ["مايكروفون بودكاست", 33, "🎙️", "إلكترونيات"],
  ["تيشيرت قطن", 20, "👕", "موضة"], ["نظارة شمسية", 40, "🕶️", "موضة"], ["حقيبة يد", 35, "👜", "موضة"], ["شنطة ظهر", 30, "🎒", "موضة"], ["خاتم فضة", 25, "💍", "موضة"], ["قلادة ألماس", 50, "💎", "موضة"], ["شماعة أزياء", 15, "🧥", "موضة"], ["تاج ملكي", 45, "👑", "موضة"],
  ["أريكة مريحة", 50, "🛋️", "المنزل"], ["سرير مريح", 50, "🛏️", "المنزل"], ["لمبة إضاءة", 18, "💡", "المنزل"], ["شمعة معطرة", 12, "🕯️", "المنزل"], ["نبتة زينة", 15, "🪴", "المنزل"], ["لوحة فنية", 28, "🖼️", "المنزل"], ["باب خشبي", 45, "🚪", "المنزل"], ["حوض استحمام", 50, "🛁", "المنزل"],
  ["كرة قدم", 22, "⚽", "رياضة"], ["كرة سلة", 24, "🏀", "رياضة"], ["دراجة هوائية", 50, "🚲", "رياضة"], ["أثقال رياضية", 32, "🏋️", "رياضة"], ["مضرب تنس", 28, "🎾", "رياضة"], ["حذاء رياضي", 35, "👟", "رياضة"], ["حبل قفز", 10, "🪢", "رياضة"],
  ["جزيرة خاصة", 80, "🏝️", "ترفيه"], ["سيارة أحلامك", 75, "🏎️", "ترفيه"], ["قصر على السحاب", 120, "🏰", "ترفيه"], ["رحلة إلى القمر", 60, "🚀", "ترفيه"], ["نجمة الحظ", 2, "🌟", "ترفيه"], ["سحابة أمنيات", 5, "☁️", "ترفيه"],
];
const products: Product[] = catalogSeed.map(([name, halalaPrice, emoji, category], index) => ({
  id: index + 1,
  name,
  category,
  price: halalaPrice,
  emoji,
  tag: index === 0 ? "الأكثر طلبًا" : index === 65 ? "مميز" : index === 1 ? "جديد" : undefined,
  description: "منتج افتراضي للمتعة فقط، لا يوجد شحن أو توصيل",
}));
const categories = ["الكل", "أكل", "مشروبات", "حلويات", "إلكترونيات", "موضة", "المنزل", "رياضة", "ترفيه"];
const categoryClass: Record<string, string> = { "أكل": "food", "مشروبات": "drinks", "حلويات": "desserts", "إلكترونيات": "tech", "موضة": "fashion", "المنزل": "home", "رياضة": "sports", "ترفيه": "fun" };
const currency = new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 2 });
const halalas = (value: number) => `${value.toLocaleString("ar-SA")} هللة`;
const priceText = (value: number) => `${halalas(value)} · ${currency.format(value / 100)}`;

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mada");
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
    if (cartItems.length > 0) {
      setAuthMessage("");
      setAuthOpen(false);
      setCheckoutOpen(true);
    } else {
      setAuthMessage("تم إنشاء حسابك محليًا. ربط البريد الفعلي يحتاج مزود إرسال بريد في مرحلة الإطلاق.");
    }
  };

  const claimReward = () => {
    if (reward) {
      setRewardMessage("استلمت مكافأتك اليوم. ارجع غدًا لمفاجأة جديدة.");
      return;
    }
    setReward(true);
    setRewardMessage("أضفنا ٢٥ هللة رمزية لرصيدك التجريبي.");
  };
  const startCheckout = () => {
    if (!user) {
      setAuthMessage("سجّل بريدك أولًا حتى نحفظ طلبك ونفتح خطوة الدفع.");
      setAuthOpen(true);
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
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
            <h1>اشترِ الشيء<br /><em>الذي لا تحتاجه.</em></h1>
            <p>وِشّ متجر ترفيهي تشتري منه أشياء افتراضية بأسعار رمزية. قهوة، سيارة، جزيرة أو قصر… لا شحن ولا توصيل، فقط لحظة ممتعة.</p>
            <div className="hero-actions"><button className="button-primary" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>ابدأ الاستكشاف <Icon name="arrow" /></button><span className="hero-note">منتجات رقمية فقط · تجربة آمنة</span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><div className="art-card"><span>01</span><strong>لحظة<br />لك</strong><small>تستحقها اليوم</small></div><div className="art-chip chip-one">✦ هدية رقمية</div><div className="art-chip chip-two">مزاج ↑</div></div>
        </section>

        <section className="proof-strip" aria-label="معلومات الثقة"><div><strong>100%</strong><span>رقمي وفوري</span></div><div><strong>0</strong><span>بيانات بطاقة</span></div><div><strong>25 هللة</strong><span>مكافأة يومية</span></div><div><strong>∞</strong><span>أمنيات ممكنة</span></div></section>

        <section id="shop" className="shop-section">
          <div className="section-heading"><div><span className="section-kicker">المتجر الافتراضي</span><h2>وش تشتري لو ما فيه حدود؟</h2><p>تصفح أشياء ممتعة، رمزية، ولا تصل إلى باب بيتك.</p></div><label className="search-box"><Icon name="search" /><input aria-label="ابحث في المنتجات" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن قهوة، جزيرة…" /></label></div>
          <div className="filters" aria-label="تصنيف المنتجات">{categories.map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className={`product-visual visual-${categoryClass[product.category]}`}><span>{product.emoji}</span><i>✦</i>{product.tag && <b>{product.tag}</b>}</div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><strong>{priceText(product.price)}</strong><button className="add-button" onClick={() => add(product.id)} aria-label={`إضافة ${product.name} إلى السلة`}>أضف <Icon name="cart" /></button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty">لم نجد ما تبحث عنه. جرّب كلمة أخرى…</div>}
        </section>

        <section id="business" className="business-section"><div className="business-heading"><span className="section-kicker">كيف يعمل؟</span><h2>تجربة شراء واضحة وآمنة</h2><p>تختار شيئًا، تدفع مبلغًا رمزيًا، وتحصل على بطاقة رقمية تثبت ملكيتك للحظة.</p></div><div className="business-grid"><div><span>01</span><h3>تصفح بلا حدود</h3><p>منتجات خيالية مستوحاة من الأشياء التي نتمنى امتلاكها يومًا.</p></div><div><span>02</span><h3>سعر رمزي</h3><p>الأسعار بالهللات والريال، لتكون التجربة خفيفة وواضحة من البداية.</p></div><div><span>03</span><h3>لا يوجد توصيل</h3><p>كل ما تشتريه افتراضي، ولا نطلب عنوانًا أو بيانات شحن أو وعودًا مضللة.</p></div></div><div className="payment-plan"><div><span className="plan-dot" /><div><strong>الدفع الحقيقي جاهز للربط</strong><p>سنربط Stripe أو Moyasar عند اختيار مزودك وإضافة مفاتيح الحساب — لا نخزّن بيانات البطاقات هنا.</p></div></div><span className="coming-soon">تجربة تجريبية الآن</span></div></section>

        <section id="rewards" className="reward-section"><div><span className="section-kicker">ولاء بسيط</span><h2>خذ مكافأتك، بدون إعلانات مزعجة</h2><p>سجّل بالبريد لتحفظ رصيدك وتعود كل يوم لمكافأة رمزية.</p><button className="button-dark" onClick={user ? claimReward : () => setAuthOpen(true)}>{user ? (reward ? "تم استلام مكافأة اليوم" : "استلام ٢٥ هللة") : "أنشئ حسابك بالبريد"} <Icon name="arrow" /></button>{rewardMessage && <p className="reward-message" aria-live="polite">{rewardMessage}</p>}</div><div className="reward-visual" aria-hidden="true"><span>25</span><small>هللة</small><i>✦</i></div></section>
        <footer className="footer"><span>© 2026 وِشّ</span><span>منتجات افتراضية · الدفع الحقيقي يُفعّل عند الإطلاق</span></footer>
      </div>

      {cartOpen && <div className="overlay" role="presentation" onClick={() => setCartOpen(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">مراجعة هادئة</span><h2 id="cart-title">سلتك <small>({count})</small></h2></div><button className="icon-close" onClick={() => setCartOpen(false)} aria-label="إغلاق السلة"><Icon name="close" /></button></div>{cartItems.length === 0 ? <div className="empty">السلة فاضية حاليًا.<br />خذ وقتك وتصفح المنتجات.</div> : <>{cartItems.map((product) => <div className="cart-line" key={product.id}><span className="cart-emoji">{product.emoji}</span><div><strong>{product.name}</strong><small>{priceText(product.price)}</small></div><div className="quantity"><button onClick={() => remove(product.id)} aria-label={`تقليل ${product.name}`}>−</button><b>{cart[product.id]}</b><button onClick={() => add(product.id)} aria-label={`زيادة ${product.name}`}>+</button></div></div>)}<div className="cart-total"><span>الإجمالي</span><strong>{priceText(Math.max(0, total - (reward ? 25 : 0)))}</strong><small>منتجات افتراضية · لا يوجد شحن</small></div><button className="checkout-button" onClick={startCheckout}>{user ? "المتابعة بهدوء" : "تسجيل البريد للمتابعة"}</button></>}</aside></div>}

      {checkoutOpen && <div className="modal-wrap" onClick={() => setCheckoutOpen(false)}><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={(event) => event.stopPropagation()}>{orderComplete ? <div className="order-success"><div className="success-mark"><Icon name="check" /></div><span className="section-kicker">تم حفظ طلبك</span><h2>جاهز للحظة حلوة 🎉</h2><p>هذا تأكيد تجريبي فقط. عند تفعيل Stripe أو مدى سيصلك رابط الدفع الحقيقي هنا.</p><button className="button-dark full-button" onClick={() => { setCheckoutOpen(false); setOrderComplete(false); setCart({}); }}>العودة للمتجر</button></div> : <><div className="drawer-head"><div><span className="section-kicker">الخطوة الأخيرة</span><h2 id="checkout-title">أكمل طلبك</h2></div><button className="icon-close" onClick={() => setCheckoutOpen(false)} aria-label="إغلاق الدفع"><Icon name="close" /></button></div><div className="checkout-total"><span>الإجمالي التجريبي</span><strong>{priceText(Math.max(0, total - (reward ? 25 : 0)))}</strong></div><p className="checkout-disclaimer">الدفع الحقيقي غير موصول حاليًا. اختر وسيلة الدفع لتجربة الشكل النهائي بدون خصم أي مبلغ.</p><fieldset className="payment-options"><legend>طريقة الدفع</legend>{[["mada", "مدى", "بطاقة مدى السعودية"], ["card", "بطاقة بنكية", "Visa أو Mastercard"], ["apple", "Apple Pay", "دفع سريع من الجوال"]].map(([value, title, detail]) => <label className={paymentMethod === value ? "payment-option selected" : "payment-option"} key={value}><input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} /><span className="payment-logo">{value === "apple" ? "" : value === "mada" ? "مدى" : "•••"}</span><span><strong>{title}</strong><small>{detail}</small></span><i>✓</i></label>)}</fieldset><button className="checkout-button" onClick={() => setOrderComplete(true)}>تأكيد الطلب التجريبي <Icon name="arrow" /></button><small className="secure-note">🔒 لا يتم خصم أي مبلغ في هذه النسخة التجريبية</small></>}</section></div>}

      {authOpen && <div className="modal-wrap" onClick={() => setAuthOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()}><button className="icon-close modal-close" onClick={() => setAuthOpen(false)} aria-label="إغلاق نافذة الحساب"><Icon name="close" /></button><div className="auth-symbol">و</div><span className="section-kicker">مساحتك في وِشّ</span><h2 id="auth-title">{user ? "أهلًا بعودتك" : "احفظ أمنياتك بهدوء"}</h2><p>{user ? `مسجل بالبريد: ${user.email}` : "استخدم بريدك فقط. لا كلمة مرور، ولا رسائل مزعجة."}</p>{user ? <><button className="button-soft full-button" onClick={() => { setSettingsOpen(true); setAuthOpen(false); }}>الإعدادات والتفضيلات</button><button className="button-dark full-button" onClick={() => { setUser(null); window.localStorage.removeItem("wish-user"); setAuthOpen(false); }}>تسجيل الخروج</button></> : <form onSubmit={signUp}><label htmlFor="email">البريد الإلكتروني</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="name@example.com" required /><button className="button-dark full-button" type="submit">إنشاء حساب بالبريد <Icon name="arrow" /></button>{authError && <p className="form-error" role="alert">{authError}</p>}{authMessage && <p className="form-success" aria-live="polite">{authMessage}</p>}</form>}<small className="auth-footnote"><Icon name="check" /> حساب تجريبي محلي الآن، وجاهز للربط بتسجيل دخول حقيقي عند الإطلاق.</small></section></div>}
      {settingsOpen && <div className="modal-wrap" onClick={() => setSettingsOpen(false)}><section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">تخصيص بسيط</span><h2 id="settings-title">الإعدادات</h2></div><button className="icon-close" onClick={() => setSettingsOpen(false)} aria-label="إغلاق الإعدادات"><Icon name="close" /></button></div><div className="settings-profile"><div className="profile-avatar">{user?.email.slice(0, 1).toUpperCase()}</div><div><strong>{user?.email}</strong><small>حساب تجريبي محلي</small></div></div><label className="setting-row"><span><strong>رسائل المنتجات الجديدة</strong><small>أرسلوا لي مفاجآت وكتالوجات جديدة</small></span><input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} /></label><div className="settings-note">يمكن ربط الإشعارات وتسجيل الدخول الحقيقي عند إضافة مزود مصادقة مثل Supabase أو Clerk.</div><button className="button-dark full-button" onClick={() => setSettingsOpen(false)}>حفظ والعودة</button></section></div>}
    </main>
  );
}
