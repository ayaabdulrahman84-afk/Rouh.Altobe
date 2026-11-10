const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// إعدادات البريد - يدعم Resend API (الأكثر ضماناً على Render) / Brevo SMTP / Gmail محلياً
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const USE_RESEND = !!RESEND_API_KEY;
const USE_BREVO = !USE_RESEND && !!(process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_KEY);
const EMAIL_USER = process.env.EMAIL_USER || process.env.BREVO_SMTP_USER || 'shirtclothes5@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || process.env.BREVO_SMTP_KEY || 'riwuoadcclkgctrc';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shirtclothes5@gmail.com';
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL || 'onboarding@resend.dev';
const SENDER_NAME = process.env.SENDER_NAME || 'روح الثوب للخياطة الفاخرة';

// حفظ الطلب محلياً في ملف JSON لضمان عدم ضياع أي طلب إطلاقاً
function saveOrderLocally(orderData) {
  try {
    let orders = [];
    if (fs.existsSync(ORDERS_FILE)) {
      try {
        const fileContent = fs.readFileSync(ORDERS_FILE, 'utf8');
        orders = JSON.parse(fileContent || '[]');
      } catch (e) {
        orders = [];
      }
    }
    const orderRecord = {
      id: 'ORD-' + Date.now(),
      created_at: new Date().toLocaleString('ar-SA'),
      status: 'pending',
      ...orderData
    };
    orders.unshift(orderRecord);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return orderRecord;
  } catch (err) {
    console.error('⚠️ تحذير: تعذر حفظ الطلب محلياً:', err.message);
    return null;
  }
}

// تحديث حالة الطلب في ملف orders.json
function updateOrderStatus(orderId, status, errorInfo = null) {
  try {
    if (!orderId || !fs.existsSync(ORDERS_FILE)) return;
    const fileContent = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(fileContent || '[]');
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.status = status;
      if (errorInfo) target.email_error = errorInfo;
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    }
  } catch (err) {
    // تجاهل أخطاء التحديث الثانوية
  }
}

// إعداد خدمة البريد
let transporter = null;

async function sendEmail(options) {
  // أولوية 1: Resend API
  if (USE_RESEND && RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: options.from || `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to: Array.isArray(options.to) ? options.to : [options.to],
          reply_to: options.replyTo || options.reply_to,
          subject: options.subject,
          text: options.text,
          html: options.html
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Resend API error: ${response.status}`);
      }
      return { success: true, provider: 'resend', id: data.id };
    } catch (err) {
      console.error('⚠️ فشل الإرسال عبر Resend API:', err.message);
      throw err;
    }
  }

  // أولوية 2: Brevo SMTP
  if (USE_BREVO) {
    if (!transporter) {
      transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_KEY
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        tls: {
          rejectUnauthorized: true
        }
      });
    }
    const info = await transporter.sendMail(options);
    return { success: true, provider: 'brevo', info };
  }

  // أولوية 3: Gmail SMTP (محلياً فقط)
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }
  const info = await transporter.sendMail(options);
  return { success: true, provider: 'gmail', info };
}

// طباعة وضع البريد عند بدء التشغيل
if (USE_RESEND) {
  console.log(`📧 وضع البريد: Resend API (مُفعّل) | المرسل: ${SENDER_NAME} <${SENDER_EMAIL}>`);
} else if (USE_BREVO) {
  console.log('📧 وضع البريد: Brevo SMTP (مُفعّل)');
} else {
  console.log('📧 وضع البريد: Gmail SMTP (محلياً)');
}

// التحقق من صحة الاتصال بالبريد عند بدء التشغيل
if (USE_BREVO && !USE_RESEND) {
  transporter = transporter || nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  transporter.verify((error) => {
    if (error) {
      console.error('❌ تنبيه: خطأ في الاتصال بخدمة البريد:', error.message);
    } else {
      console.log('✅ تم الاتصال بخدمة البريد بنجاح! جاهز لاستقبال الطلبات.');
    }
  });
} else if (!USE_RESEND && !USE_BREVO) {
  transporter = transporter || nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  transporter.verify((error) => {
    if (error) {
      console.error('❌ تنبيه: خطأ في الاتصال بخدمة البريد:', error.message);
    } else {
      console.log('✅ تم الاتصال بخدمة البريد بنجاح! جاهز لاستقبال الطلبات.');
