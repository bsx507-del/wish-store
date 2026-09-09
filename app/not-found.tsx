export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#030806", color: "#eff9ed", textAlign: "center" }}>
      <div>
        <p style={{ color: "#baff83" }}>وِشّ</p>
        <h1>الصفحة غير موجودة</h1>
        <p style={{ color: "#adc1af" }}>خلّنا نرجعك لاختيارات اللحظة.</p>
        <a href="/wish-store/" style={{ display: "inline-block", marginTop: 16, padding: "12px 18px", borderRadius: 10, background: "#7863d8", color: "#fff" }}>العودة للمتجر</a>
      </div>
    </main>
  );
}
