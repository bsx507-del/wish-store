# إطلاق وِشّ التجاري

## ما تم تجهيزه

- النسخة العامة الحالية على GitHub Pages تبقى محاكاة ولا تجمع أموالًا.
- `server/moyasar.ts` يحتوي adapter خادمي أولي لا يقرأ المفتاح إلا من متغير server-only.
- `supabase/schema.sql` يجهز جداول المنتجات والطلبات والعناصر مع RLS.
- `next.config.mjs` يستخدم static export على GitHub Pages، ويتحول إلى server mode تلقائيًا عند تشغيل Vercel عبر `VERCEL=1`.

## خطوات التفعيل الفعلية

1. أنشئ مشروع Supabase، شغّل `supabase/schema.sql`، وأنشئ مستخدمًا اختباريًا.
2. ارفع المستودع إلى Vercel كـ Next.js، وأضف `VERCEL=1`.
3. أضف في Vercel فقط: `NEXT_PUBLIC_SUPABASE_URL`، `NEXT_PUBLIC_SUPABASE_ANON_KEY`، `SUPABASE_SERVICE_ROLE_KEY`، `MOYASAR_SECRET_KEY`، و`MOYASAR_WEBHOOK_SECRET`.
4. أنشئ route handler مثل `app/api/payments/create/route.ts` يستدعي adapter بعد:
   - التحقق من جلسة المستخدم.
   - قراءة أسعار المنتجات من Supabase، وعدم الثقة بإجمالي المتصفح.
   - إنشاء order بحالة `pending` و`idempotency key`.
   - إرسال `sourceToken` إلى Moyasar.
5. أنشئ webhook server للتحقق من توقيع Moyasar، ثم حدّث الطلب إلى `paid` أو `failed`. لا تعتبر redirect من المتصفح إثباتًا للدفع.
6. بعد نجاح webhook فقط، اعرض النتيجة للمستخدم وسجّل `provider_reference`.
7. اختبر بطاقات sandbox، الفشل، الإلغاء، التكرار، والعودة من الجوال قبل تفعيل live.
8. حدّث الشروط والخصوصية وسياسة الاسترجاع وبيانات المنشأة قبل استقبال أول مبلغ.

## بوابة الإطلاق

لا تفعّل `MOYASAR_SECRET_KEY` أو live mode في GitHub Pages، ولا تضع أي مفتاح سري في `NEXT_PUBLIC_*`. لا يوجد تحصيل حقيقي في الرابط العام الحالي حتى تكتمل هذه الخطوات.
