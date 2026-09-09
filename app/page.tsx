"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; price: number; emoji: string; image: string; tag?: string; description: string };
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
const imageKeywords: Record<string, string> = {
  "🍔": "burger", "🍕": "pizza", "🥪": "sandwich", "🥗": "salad", "🍲": "soup", "🍳": "eggs", "🥖": "bread", "🧀": "cheese", "🥩": "steak", "🐟": "grilled-fish", "🍎": "red-apple", "🍒": "cherries", "🥕": "carrot", "🍄": "mushroom", "🍿": "popcorn",
  "🥤": "soda", "🧋": "iced-coffee", "🍵": "tea", "🥭": "mango-juice", "🍊": "orange-juice", "☕": "espresso", "🥛": "chocolate-milk", "🍹": "mojito", "🍋": "lemonade", "💧": "sparkling-water",
  "🍩": "donut", "🍓": "strawberry-ice-cream", "🍰": "chocolate-cake", "🍫": "chocolate", "🍬": "candy", "🍪": "cookies", "🧁": "baklava", "🫐": "blueberry-muffin",
  "🎧": "wireless-headphones", "⌚": "smartwatch", "📱": "smartphone", "💻": "laptop", "📷": "professional-camera", "📺": "television", "⌨️": "keyboard", "🖱️": "computer-mouse", "🖨️": "printer", "🎮": "game-controller", "🎙️": "podcast-microphone",
  "👕": "cotton-tshirt", "🕶️": "sunglasses", "👜": "handbag", "🎒": "backpack", "💍": "silver-ring", "💎": "diamond-necklace", "🧥": "fashion-jacket", "👑": "crown",
  "🛋️": "comfortable-sofa", "🛏️": "bedroom", "💡": "lamp", "🕯️": "scented-candle", "🪴": "house-plant", "🖼️": "art-painting", "🚪": "wooden-door", "🛁": "bathtub",
  "⚽": "soccer-ball", "🏀": "basketball", "🚲": "bicycle", "🏋️": "gym-weights", "🎾": "tennis-racket", "👟": "running-shoes", "🪢": "jump-rope",
  "🏝️": "private-island", "🏎️": "sports-car", "🏰": "castle", "🚀": "moon-rocket", "🌟": "lucky-star", "☁️": "dream-cloud",
};
const escapeSvg = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] || character);
const productArtwork = (emoji: string, hue: number) => {
  const stroke = "#d9ff8a";
  const fill = `hsl(${hue} 45% 44%)`;
  if (["🍔", "🍕", "🥪", "🥗", "🍲", "🍳", "🥖", "🧀", "🥩", "🐟", "🍎", "🍒", "🥕", "🍄", "🍿"].includes(emoji)) {
    return `<ellipse cx="450" cy="410" rx="250" ry="42" fill="#010403" opacity=".45"/><path d="M220 350 Q450 175 680 350 V390 H220Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/><path d="M250 390h400" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/><path d="M290 435h320" stroke="#d9ff8a" stroke-width="11" stroke-linecap="round" opacity=".75"/><circle cx="355" cy="280" r="13" fill="${stroke}"/><circle cx="480" cy="250" r="10" fill="${stroke}"/><circle cx="550" cy="300" r="14" fill="${stroke}"/>`;
  }
  if (["🥤", "🧋", "🍵", "🥭", "🍊", "☕", "🥛", "🍹", "🍋", "💧"].includes(emoji)) {
    return `<ellipse cx="450" cy="475" rx="160" ry="28" fill="#010403" opacity=".5"/><path d="M335 205h230l-22 250H357Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/><path d="M420 205L490 78" stroke="${stroke}" stroke-width="12" stroke-linecap="round"/><path d="M372 270h156" stroke="${stroke}" stroke-width="7" opacity=".7"/><circle cx="440" cy="330" r="17" fill="#d9ff8a" opacity=".65"/><circle cx="490" cy="390" r="12" fill="#d9ff8a" opacity=".65"/>`;
  }
  if (["🍩", "🍓", "🍰", "🍫", "🍬", "🍪", "🧁", "🫐"].includes(emoji)) {
    return `<ellipse cx="450" cy="465" rx="245" ry="32" fill="#010403" opacity=".5"/><path d="M235 400 Q450 300 665 400v35H235Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/><path d="M285 330 Q450 155 615 330" fill="none" stroke="${stroke}" stroke-width="28" stroke-linecap="round"/><circle cx="355" cy="250" r="14" fill="${stroke}"/><circle cx="470" cy="215" r="11" fill="${stroke}"/><circle cx="550" cy="270" r="13" fill="${stroke}"/>`;
  }
  if (["🎧", "⌚", "📱", "💻", "📷", "📺", "⌨️", "🖱️", "🖨️", "🎮", "🎙️"].includes(emoji)) {
    return `<rect x="245" y="145" width="410" height="280" rx="28" fill="${fill}" stroke="${stroke}" stroke-width="9"/><rect x="285" y="185" width="330" height="190" rx="14" fill="#06100a" stroke="#9bea6a" stroke-width="5"/><path d="M210 465h480" stroke="${stroke}" stroke-width="14" stroke-linecap="round"/><circle cx="450" cy="280" r="42" fill="#d9ff8a" opacity=".22"/><path d="M430 280h40M450 260v40" stroke="${stroke}" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (["👕", "🕶️", "👜", "🎒", "💍", "💎", "🧥", "👑"].includes(emoji)) {
    return `<path d="M330 170l-105 75 55 75 42-30v190h256V290l42 30 55-75-105-75-70 55h-100Z" fill="${fill}" stroke="${stroke}" stroke-width="9" stroke-linejoin="round"/><path d="M405 190q45 55 90 0" fill="none" stroke="${stroke}" stroke-width="8"/>`;
  }
  if (["🛋️", "🛏️", "💡", "🕯️", "🪴", "🖼️", "🚪", "🛁"].includes(emoji)) {
    return `<rect x="240" y="245" width="420" height="220" rx="30" fill="${fill}" stroke="${stroke}" stroke-width="9"/><rect x="285" y="195" width="330" height="115" rx="25" fill="#06100a" stroke="${stroke}" stroke-width="8"/><path d="M320 465v45M580 465v45" stroke="${stroke}" stroke-width="12" stroke-linecap="round"/><circle cx="450" cy="270" r="34" fill="#d9ff8a" opacity=".45"/>`;
  }
  if (["⚽", "🏀", "🚲", "🏋️", "🎾", "👟", "🪢"].includes(emoji)) {
    return `<circle cx="450" cy="315" r="150" fill="${fill}" stroke="${stroke}" stroke-width="10"/><path d="M450 165v300M300 315h300M345 210l210 210M555 210L345 420" stroke="${stroke}" stroke-width="8" opacity=".8"/><ellipse cx="450" cy="490" rx="220" ry="25" fill="#010403" opacity=".5"/>`;
  }
  return `<circle cx="450" cy="305" r="155" fill="${fill}" stroke="${stroke}" stroke-width="10"/><circle cx="450" cy="305" r="95" fill="#06100a" stroke="${stroke}" stroke-width="6"/><path d="M450 110v390M255 305h390" stroke="${stroke}" stroke-width="5" opacity=".55"/><ellipse cx="450" cy="490" rx="220" ry="25" fill="#010403" opacity=".5"/>`;
};
const productPhotos: Record<string, string> = {
  "🍔": "photo-1568901346375-23c9450c58cd", "🍕": "photo-1574071318508-1cdbab80d002", "🥪": "photo-1528735602780-2552fd46c7af", "🥗": "photo-1546793665-c74683f339c1", "🍲": "photo-1547592180-85f173990554", "🍳": "photo-1525351484163-7529414344d8", "🥖": "photo-1509440159596-0249088772ff", "🧀": "photo-1486297678162-eb2a19b0a32d", "🥩": "photo-1546833999-b9f581a1996d", "🐟": "photo-1519708227418-c8fd9a32b2a2", "🍎": "photo-1560806887-1e4cd0b6cbd6", "🍒": "photo-1528825871115-3581a5387919", "🥕": "photo-1445282768818-728615cc910a", "🍄": "photo-1504674900247-0877df9cc836", "🍿": "photo-1585647347483-22b66260dfff",
  "🥤": "photo-1544145945-f90425340c7e", "🧋": "photo-1558857563-b371033873b8", "🍵": "photo-1544787219-7f47ccb76574", "🥭": "photo-1623065422902-30a2d299bbe4", "🍊": "photo-1600271886742-f049cd451bba", "☕": "photo-1495474472287-4d71bcdd2085", "🥛": "photo-1572449043416-55f4685c9bb7", "🍹": "photo-1551024709-8f23befc6f87", "🍋": "photo-1513558161293-cdaf765ed2fd", "💧": "photo-1559825481-12a05cc00344",
  "🍩": "photo-1551024506-0bccd828d307", "🍓": "photo-1497034825429-c343d7c6a68f", "🍰": "photo-1578985545062-69928b1d9587", "🍫": "photo-1575377427642-087cf684f29d", "🍬": "photo-1582058091505-f87a2e55a40f", "🍪": "photo-1499636136210-6f4ee915583e", "🧁": "photo-1559622214-f8a9850965bb", "🫐": "photo-1558961363-fa8fdf82db35",
  "🎧": "photo-1505740420928-5e560c06d30e", "⌚": "photo-1523275335684-37898b6baf30", "📱": "photo-1511707171634-5f897ff02aa9", "💻": "photo-1496181133206-80ce9b88a853", "📷": "photo-1516035069371-29a1b244cc32", "📺": "photo-1593359677879-a4bb92f829d1", "⌨️": "photo-1587829741301-dc798b83add3", "🖱️": "photo-1527814050087-3793815479db", "🖨️": "photo-1612815154858-60aa4c59eaa6", "🎮": "photo-1600080972464-8e5f35f63d08", "🎙️": "photo-1590602847861-f357a9332bbc",
  "👕": "photo-1521572163474-6864f9cf17ab", "🕶️": "photo-1511499767150-a48a237f0083", "👜": "photo-1584917865442-de89df76afd3", "🎒": "photo-1553062407-98eeb64c6a62", "💍": "photo-1605100804763-247f67b3557e", "💎": "photo-1515562141207-7a88fb7ce338", "🧥": "photo-1551488831-00ddcb6c6bd3", "👑": "photo-1535632066927-ab7c9ab60908",
  "🛋️": "photo-1555041469-a586c61ea9bc", "🛏️": "photo-1505693416388-ac5ce068fe85", "💡": "photo-1507473885765-e6ed057f782c", "🕯️": "photo-1603006905003-be475563bc59", "🪴": "photo-1485955900006-10f4d324d411", "🖼️": "photo-1549490349-8643362247b5", "🚪": "photo-1513694203232-719a280e022f", "🛁": "photo-1584622650111-993a426fbf0a",
  "⚽": "photo-1553778263-73a83bab9b0c", "🏀": "photo-1546519638-68e109498ffc", "🚲": "photo-1485965120184-e220f721d03e", "🏋️": "photo-1534438327276-14e5300c3a48", "🎾": "photo-1617083934555-5bfa0e4e2ebf", "👟": "photo-1542291026-7eec264c27ff", "🪢": "photo-1599058917212-d750089bc07e",
  "🏝️": "photo-1500534623283-312aade485b7", "🏎️": "photo-1503736334956-4c8f8e92946d", "🏰": "photo-1539650116574-75c0c6d73f6e", "🚀": "photo-1446776811953-b23d57bd21aa", "🌟": "photo-1519608487953-e999c86e7455", "☁️": "photo-1499346030926-9a72daac6c63",
};
const productImage = (emoji: string) => `https://images.unsplash.com/${productPhotos[emoji] || "photo-1494438639946-1ebd1d20bf85"}?auto=format&fit=crop&w=900&q=88`;
const products: Product[] = catalogSeed.map(([name, halalaPrice, emoji, category], index) => ({
  id: index + 1,
  name,
  category,
  price: halalaPrice,
  emoji,
  image: productImage(emoji),
  tag: index === 0 ? "الأكثر طلبًا" : index === 65 ? "مميز" : index === 1 ? "جديد" : undefined,
  description: "منتج افتراضي للمتعة فقط، لا يوجد شحن أو توصيل",
}));
const categories = ["الكل", "أكل", "مشروبات", "حلويات", "إلكترونيات", "موضة", "المنزل", "رياضة", "ترفيه"];
const categoryClass: Record<string, string> = { "أكل": "food", "مشروبات": "drinks", "حلويات": "desserts", "إلكترونيات": "tech", "موضة": "fashion", "المنزل": "home", "رياضة": "sports", "ترفيه": "fun" };
const currency = new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", minimumFractionDigits: 2 });
const halalas = (value: number) => `${value.toLocaleString("ar-SA")} هللة`;
const priceText = (value: number) => `${(value / 100).toFixed(2)}`;

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
  const [wallet, setWallet] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletMessage, setWalletMessage] = useState("");
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
    const savedWallet = window.localStorage.getItem("wish-wallet");
    if (savedCart) setCart(JSON.parse(savedCart) as Record<number, number>);
    if (savedUser) setUser(JSON.parse(savedUser) as User);
    if (savedWallet) setWallet(Number(savedWallet));
  }, []);
  useEffect(() => { window.localStorage.setItem("wish-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem("wish-wallet", String(wallet)); }, [wallet]);
  useEffect(() => {
    let frame = 0;
    const moveSurface = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", moveSurface, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", moveSurface);
    };
  }, []);

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
  const payOrder = () => {
    const payable = Math.max(0, total - (reward ? 25 : 0));
    if (wallet < payable) {
      setCheckoutOpen(false);
      setWalletOpen(true);
      setWalletMessage(`رصيدك ${priceText(wallet)} ر.س، وتحتاج ${priceText(payable)} ر.س لإتمام السلة.`);
      return;
    }
    setWallet(wallet - payable);
    setOrderComplete(true);
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
      <div className="liquid-cursor" aria-hidden="true" />
      <a className="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
      <header className="topbar shell">
        <a className="brand" href="#" aria-label="وِشّ، الصفحة الرئيسية"><span className="brand-mark">و</span><span>وِشّ</span></a>
        <nav className="nav-links" aria-label="التنقل الرئيسي"><a href="#shop">اكتشف</a><a href="#business">كيف نكسب؟</a><a href="#rewards">المكافآت</a></nav>
        <div className="top-actions">
          <button className="wallet-button" onClick={() => setWalletOpen(true)} aria-label={`الرصيد ${priceText(wallet)} ريال`}><span>رصيدي</span><b>{priceText(wallet)}</b></button>
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
          <div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className={`product-visual visual-${categoryClass[product.category]}`}><img src={product.image} alt={product.name} width="900" height="600" loading="lazy" /><span>{product.emoji}</span><i>✦</i>{product.tag && <b>{product.tag}</b>}</div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><strong>{priceText(product.price)}</strong><button className="add-button" onClick={() => add(product.id)} aria-label={`إضافة ${product.name} إلى السلة`}>أضف <Icon name="cart" /></button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty">لم نجد ما تبحث عنه. جرّب كلمة أخرى…</div>}
        </section>

        <section id="business" className="business-section"><div className="business-heading"><span className="section-kicker">كيف يعمل؟</span><h2>تجربة شراء واضحة وآمنة</h2><p>تختار شيئًا، تدفع مبلغًا رمزيًا، وتحصل على بطاقة رقمية تثبت ملكيتك للحظة.</p></div><div className="business-grid"><div><span>01</span><h3>تصفح بلا حدود</h3><p>منتجات خيالية مستوحاة من الأشياء التي نتمنى امتلاكها يومًا.</p></div><div><span>02</span><h3>سعر رمزي</h3><p>الأسعار بالهللات والريال، لتكون التجربة خفيفة وواضحة من البداية.</p></div><div><span>03</span><h3>لا يوجد توصيل</h3><p>كل ما تشتريه افتراضي، ولا نطلب عنوانًا أو بيانات شحن أو وعودًا مضللة.</p></div></div><div className="payment-plan"><div><span className="plan-dot" /><div><strong>الدفع الحقيقي جاهز للربط</strong><p>سنربط Stripe أو Moyasar عند اختيار مزودك وإضافة مفاتيح الحساب — لا نخزّن بيانات البطاقات هنا.</p></div></div><span className="coming-soon">تجربة تجريبية الآن</span></div></section>

        <section id="rewards" className="reward-section"><div><span className="section-kicker">ولاء بسيط</span><h2>خذ مكافأتك، بدون إعلانات مزعجة</h2><p>سجّل بالبريد لتحفظ رصيدك وتعود كل يوم لمكافأة رمزية.</p><button className="button-dark" onClick={user ? claimReward : () => setAuthOpen(true)}>{user ? (reward ? "تم استلام مكافأة اليوم" : "استلام ٢٥ هللة") : "أنشئ حسابك بالبريد"} <Icon name="arrow" /></button>{rewardMessage && <p className="reward-message" aria-live="polite">{rewardMessage}</p>}</div><div className="reward-visual" aria-hidden="true"><span>25</span><small>هللة</small><i>✦</i></div></section>
        <footer className="footer"><span>© 2026 وِشّ</span><span>منتجات افتراضية · الدفع الحقيقي يُفعّل عند الإطلاق</span></footer>
      </div>

      {cartOpen && <div className="overlay" role="presentation" onClick={() => setCartOpen(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">مراجعة هادئة</span><h2 id="cart-title">سلتك <small>({count})</small></h2></div><button className="icon-close" onClick={() => setCartOpen(false)} aria-label="إغلاق السلة"><Icon name="close" /></button></div>{cartItems.length === 0 ? <div className="empty">السلة فاضية حاليًا.<br />خذ وقتك وتصفح المنتجات.</div> : <>{cartItems.map((product) => <div className="cart-line" key={product.id}><img className="cart-emoji" src={product.image} alt="" width="50" height="50" /><div><strong>{product.name}</strong><small>{priceText(product.price)} ر.س</small></div><div className="quantity"><button onClick={() => remove(product.id)} aria-label={`تقليل ${product.name}`}>−</button><b>{cart[product.id]}</b><button onClick={() => add(product.id)} aria-label={`زيادة ${product.name}`}>+</button></div></div>)}<div className="cart-total"><span>الإجمالي</span><strong>{priceText(Math.max(0, total - (reward ? 25 : 0)))} <small>ر.س</small></strong><small>منتجات افتراضية · لا يوجد شحن</small></div><div className="wallet-hint">رصيدك الحالي: <b>{priceText(wallet)} ر.س</b></div><button className="checkout-button" onClick={startCheckout}>{user ? "المتابعة بهدوء" : "تسجيل البريد للمتابعة"}</button></>}</aside></div>}

      {checkoutOpen && <div className="modal-wrap" onClick={() => setCheckoutOpen(false)}><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={(event) => event.stopPropagation()}>{orderComplete ? <div className="order-success"><div className="success-mark"><Icon name="check" /></div><span className="section-kicker">تم حفظ طلبك</span><h2>جاهز للحظة حلوة 🎉</h2><p>تم الخصم من رصيدك التجريبي. عند تفعيل الدفع الحقيقي سيصلك رابط المنتج هنا.</p><button className="button-dark full-button" onClick={() => { setCheckoutOpen(false); setOrderComplete(false); setCart({}); }}>العودة للمتجر</button></div> : <><div className="drawer-head"><div><span className="section-kicker">الخطوة الأخيرة</span><h2 id="checkout-title">أكمل طلبك</h2></div><button className="icon-close" onClick={() => setCheckoutOpen(false)} aria-label="إغلاق الدفع"><Icon name="close" /></button></div><div className="checkout-total"><span>الإجمالي التجريبي</span><strong>{priceText(Math.max(0, total - (reward ? 25 : 0)))} <small>ر.س</small></strong></div><div className="balance-check"><span>رصيدك الحالي</span><strong>{priceText(wallet)} ر.س</strong></div><p className="checkout-disclaimer">اختر وسيلة الدفع لتوثيق الشكل النهائي. في النسخة الحالية يتم الخصم من الرصيد التجريبي فقط.</p><fieldset className="payment-options"><legend>طريقة الدفع</legend><label className="payment-option selected"><input type="radio" name="payment" checked readOnly /><span className="payment-logo">وِشّ</span><span><strong>رصيد وِشّ</strong><small>المحفظة التجريبية</small></span><i>✓</i></label>{[["mada", "مدى", "عند الإطلاق"], ["card", "بطاقة بنكية", "Visa أو Mastercard"], ["apple", "Apple Pay", "دفع سريع من الجوال"]].map(([value, title, detail]) => <label className="payment-option muted-option" key={value}><input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} /><span className="payment-logo">{value === "apple" ? "" : value === "mada" ? "مدى" : "•••"}</span><span><strong>{title}</strong><small>{detail}</small></span><i>قريبًا</i></label>)}</fieldset><button className="checkout-button" onClick={payOrder}>الدفع من رصيدي <Icon name="arrow" /></button><small className="secure-note">🔒 لا يتم خصم أي مبلغ حقيقي في هذه النسخة</small></>}</section></div>}

      {authOpen && <div className="modal-wrap" onClick={() => setAuthOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()}><button className="icon-close modal-close" onClick={() => setAuthOpen(false)} aria-label="إغلاق نافذة الحساب"><Icon name="close" /></button><div className="auth-symbol">و</div><span className="section-kicker">مساحتك في وِشّ</span><h2 id="auth-title">{user ? "أهلًا بعودتك" : "احفظ أمنياتك بهدوء"}</h2><p>{user ? `مسجل بالبريد: ${user.email}` : "استخدم بريدك فقط. لا كلمة مرور، ولا رسائل مزعجة."}</p>{user ? <><button className="button-soft full-button" onClick={() => { setSettingsOpen(true); setAuthOpen(false); }}>الإعدادات والتفضيلات</button><button className="button-dark full-button" onClick={() => { setUser(null); window.localStorage.removeItem("wish-user"); setAuthOpen(false); }}>تسجيل الخروج</button></> : <form onSubmit={signUp}><label htmlFor="email">البريد الإلكتروني</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="name@example.com" required /><button className="button-dark full-button" type="submit">إنشاء حساب بالبريد <Icon name="arrow" /></button>{authError && <p className="form-error" role="alert">{authError}</p>}{authMessage && <p className="form-success" aria-live="polite">{authMessage}</p>}</form>}<small className="auth-footnote"><Icon name="check" /> حساب تجريبي محلي الآن، وجاهز للربط بتسجيل دخول حقيقي عند الإطلاق.</small></section></div>}
      {settingsOpen && <div className="modal-wrap" onClick={() => setSettingsOpen(false)}><section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">تخصيص بسيط</span><h2 id="settings-title">الإعدادات</h2></div><button className="icon-close" onClick={() => setSettingsOpen(false)} aria-label="إغلاق الإعدادات"><Icon name="close" /></button></div><div className="settings-profile"><div className="profile-avatar">{user?.email.slice(0, 1).toUpperCase()}</div><div><strong>{user?.email}</strong><small>حساب تجريبي محلي</small></div></div><label className="setting-row"><span><strong>رسائل المنتجات الجديدة</strong><small>أرسلوا لي مفاجآت وكتالوجات جديدة</small></span><input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} /></label><div className="settings-note">يمكن ربط الإشعارات وتسجيل الدخول الحقيقي عند إضافة مزود مصادقة مثل Supabase أو Clerk.</div><button className="button-dark full-button" onClick={() => setSettingsOpen(false)}>حفظ والعودة</button></section></div>}
      {walletOpen && <div className="modal-wrap" onClick={() => setWalletOpen(false)}><section className="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-title" onClick={(event) => event.stopPropagation()}><button className="icon-close modal-close" onClick={() => setWalletOpen(false)} aria-label="إغلاق المحفظة"><Icon name="close" /></button><div className="wallet-hero"><span>رصيدك</span><strong>{priceText(wallet)} <small>ر.س</small></strong><p>اشحن مرة، وتسوق براحة. هذه المحفظة تجريبية ولا يتم خصم أي مبلغ حقيقي.</p></div><h2 id="wallet-title">اختر قيمة الشحن</h2><div className="topup-grid">{[100, 500, 1000, 2000].map((amount) => <button key={amount} onClick={() => { setWallet(wallet + amount); setWalletMessage(`أضفنا ${priceText(amount)} ر.س إلى رصيدك التجريبي.`); }}>{priceText(amount)} <small>ر.س</small></button>)}</div>{walletMessage && <p className="form-success" aria-live="polite">{walletMessage}</p>}<small className="auth-footnote"><Icon name="check" /> الدفع الحقيقي يُفعّل لاحقًا عبر مزود دفع معتمد.</small></section></div>}
    </main>
  );
}
