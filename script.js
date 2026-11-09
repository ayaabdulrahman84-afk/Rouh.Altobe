/* === APP STATE === */
const state = {
  currentStep: 1,
  selectedFabric: null,
  selectedFabricName: null,
  selectedColor: null,
  selectedColorName: null,
  selectedSize: null,
  sizeMode: 'standard'
};

/* === FABRIC NAMES MAP === */
const fabricNames = {
  'japanese-cotton': 'قطن ياباني فاخر',
  'korean-silk': 'سلك كوري فاخر',
  'light-summer': 'قماش صيفي خفيف',
  'royal-wool': 'جوخ ملكي شتوي'
};

/* ============================================================
   NAVBAR
============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

/* ============================================================
   GOLD PARTICLES
============================================================ */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.6 + 0.1};
    `;
    container.appendChild(p);
  }
}

createParticles();

/* ============================================================
   REVEAL ON SCROLL
============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

function addRevealClasses() {
  const sections = [
    '.trust-item',
    '.fabric-card',
    '.color-card',
    '.testimonial-card',
    '.about-main-card',
    '.about-stat-card',
    '.footer-brand',
    '.footer-col'
  ];
  sections.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i > 0) el.classList.add(`reveal-delay-${Math.min(i, 3)}`);
    });
  });
}

addRevealClasses();
window.addEventListener('load', initReveal);

/* ============================================================
   EASTERN ARABIC NUMERALS & STATS COUNTER ANIMATION
============================================================ */
function toArabicDigits(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, d => arabicDigits[d]);
}

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            el.textContent = toArabicDigits(current) + '+';

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = toArabicDigits(target) + '+';
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

window.addEventListener('load', initCounters);

/* ============================================================
   HERO 3D PARALLAX TILT & CURSOR GLOW
============================================================ */
const heroVisual = document.getElementById('heroVisual');
const heroGlassCard = document.getElementById('heroGlassCard');

if (heroVisual && heroGlassCard && window.innerWidth > 900) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;

    heroGlassCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroGlassCard.style.transform = '';
  });
}

const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.innerWidth > 800) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

/* === FABRIC TO REAL THOBE IMAGE MAP === */
const fabricImages = {
  'japanese-cotton': 'images/thobe-white.jpg',
  'korean-silk': 'images/thobe-cream.jpg',
  'light-summer': 'images/thobe-summer.jpg',
  'royal-wool': 'images/thobe-charcoal.jpg'
};

function changeHeroThobe(src, el) {
  const img = document.getElementById('heroThobeImg');
  if (img) {
    img.style.opacity = '0.3';
    img.style.transform = 'scale(0.96)';
    setTimeout(() => {
      img.src = src;
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 180);
  }
  if (el) {
    document.querySelectorAll('.fabric-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  }
}

/* ============================================================
   STEP 1 – FABRIC SELECTION
============================================================ */
document.querySelectorAll('.fabric-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.fabric-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.selectedFabric = card.dataset.fabric;
    state.selectedFabricName = fabricNames[card.dataset.fabric] || card.dataset.fabric;

    if (fabricImages[card.dataset.fabric]) {
      changeHeroThobe(fabricImages[card.dataset.fabric]);
    }

    const nextBtn = document.getElementById('next-to-2');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    }

    updatePreview();
    pulseSelection(card);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

/* ============================================================
   STEP 2 – COLOR SELECTION
============================================================ */
document.querySelectorAll('.color-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.color-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.selectedColor = card.dataset.color;
    state.selectedColorName = card.dataset.colorName;

    const nextBtn = document.getElementById('next-to-3');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    }

    updatePreview();
    pulseSelection(card);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

/* ============================================================
   STEP 3 – SIZE SELECTION & PRESETS
============================================================ */
function selectSize(el) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedSize = el.dataset.size;
  updatePreview();
}

function switchSizeMode(mode) {
  state.sizeMode = mode;
  const standardPanel = document.getElementById('standard-sizes');
  const customPanel = document.getElementById('custom-sizes');
  const toggleStd = document.getElementById('toggle-standard');
  const toggleCustom = document.getElementById('toggle-custom');

  if (mode === 'standard') {
    if (standardPanel) standardPanel.classList.add('active');
    if (customPanel) customPanel.classList.remove('active');
    if (toggleStd) toggleStd.classList.add('active');
    if (toggleCustom) toggleCustom.classList.remove('active');
    state.selectedSize = null;
    updatePreview();
  } else {
    if (customPanel) customPanel.classList.add('active');
    if (standardPanel) standardPanel.classList.remove('active');
    if (toggleCustom) toggleCustom.classList.add('active');
    if (toggleStd) toggleStd.classList.remove('active');
    state.selectedSize = 'مقاسات مخصصة';
    updatePreview();
  }
}

function applyPresetSize(neck, height, shoulder, sleeve) {
  switchSizeMode('custom');

  const neckInput = document.getElementById('neck-size');
  const heightInput = document.getElementById('height-size');
  const shoulderInput = document.getElementById('shoulder-size');
  const sleeveInput = document.getElementById('sleeve-size');

  if (neckInput) neckInput.value = neck;
  if (heightInput) heightInput.value = height;
  if (shoulderInput) shoulderInput.value = shoulder;
  if (sleeveInput) sleeveInput.value = sleeve;

  [neckInput, heightInput, shoulderInput, sleeveInput].forEach(inp => {
    if (inp) {
      inp.style.borderColor = 'var(--gold-mid)';
      inp.style.background = 'rgba(184, 137, 27, 0.12)';
      setTimeout(() => {
        inp.style.borderColor = '';
        inp.style.background = '';
      }, 700);
    }
  });

  state.selectedSize = `رقبة ${neck}سم | طول ${height}سم | كتف ${shoulder}سم | أكمام ${sleeve}سم`;
  updatePreview();
}

['neck-size', 'height-size', 'shoulder-size', 'sleeve-size'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      state.selectedSize = 'مقاسات مخصصة';
      updatePreview();
    });
  }
});

/* ============================================================
   UPDATE SUMMARY PREVIEW
============================================================ */
function updatePreview() {
  const pf = document.getElementById('preview-fabric');
  const pc = document.getElementById('preview-color');
  const ps = document.getElementById('preview-size');

  if (pf) pf.textContent = state.selectedFabricName || 'لم يتم الاختيار';
  if (pc) pc.textContent = state.selectedColorName || 'لم يتم الاختيار';
  if (ps) ps.textContent = state.selectedSize || 'لم يتم الاختيار';

  let filledCount = 0;
  if (state.selectedFabric) filledCount++;
  if (state.selectedColor) filledCount++;
  if (state.selectedSize) filledCount++;

  const previewBadge = document.getElementById('previewBadge');
  if (previewBadge) {
    if (filledCount === 3) {
      previewBadge.textContent = 'جاهز لتأكيد الطلب ✓';
      previewBadge.classList.add('ready');
    } else if (filledCount === 2) {
      previewBadge.textContent = 'متبقي خطوة واحدة (٦٦٪)';
      previewBadge.classList.remove('ready');
    } else {
      previewBadge.textContent = 'قيد الاختيار (٣٣٪)';
      previewBadge.classList.remove('ready');
    }
  }
}

/* ============================================================
   INTERACTIVE STEP NAVIGATION (GoToStep)
============================================================ */
function goToStep(step) {
  if (step === state.currentStep) return;

  if (step > 1 && !state.selectedFabric) {
    const fg = document.querySelector('.fabric-grid-main');
    if (fg) pulseSelection(fg);
    return;
  }
  if (step > 2 && !state.selectedColor) {
    const cg = document.querySelector('.color-grid');
    if (cg) pulseSelection(cg);
    return;
  }

  document.querySelectorAll('.step-panel').forEach((p, idx) => {
    p.classList.toggle('active', idx + 1 === step);
  });

  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`step-indicator-${i}`);
    if (ind) {
      ind.classList.remove('active');
      if (i < step) ind.classList.add('done');
      else if (i === step) {
        ind.classList.add('active');
        ind.classList.remove('done');
      } else {
        ind.classList.remove('done');
      }
    }
  }

  const line12 = document.getElementById('line-1-2');
  const line23 = document.getElementById('line-2-3');
  if (line12) line12.classList.toggle('filled', step >= 2);
  if (line23) line23.classList.toggle('filled', step >= 3);

  const meterFill = document.getElementById('statusMeterFill');
  const stepTitle = document.getElementById('statusStepTitle');
  const stepPercent = document.getElementById('statusPercent');

  const titles = [
    'الخطوة ١ من ٣: اختر نوع القماش المناسب لك',
    'الخطوة ٢ من ٣: حدد لون الثوب المفضل لديك',
    'الخطوة ٣ من ٣: أدخل مقاساتك بدقة للحصول على تفصيل مثالي'
  ];
  const percents = ['٣٣٪ مكتمل', '٦٦٪ مكتمل', '١٠٠٪ مكتمل'];
  const widths = ['33%', '66%', '100%'];

  if (meterFill) meterFill.style.width = widths[step - 1];
  if (stepTitle) stepTitle.textContent = titles[step - 1];
  if (stepPercent) stepPercent.textContent = percents[step - 1];

  state.currentStep = step;
  const builderEl = document.getElementById('builder');
  if (builderEl) builderEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep(step) {
  goToStep(step);
}

function prevStep(step) {
  goToStep(step);
}

/* ============================================================
   ORDER MODAL
============================================================ */
function openOrderModal() {
  const mf = document.getElementById('modal-fabric');
  const mc = document.getElementById('modal-color');
  const ms = document.getElementById('modal-size');

  if (mf) mf.textContent = state.selectedFabricName || '—';
  if (mc) mc.textContent = state.selectedColorName || '—';

  let sizeText = '—';
  if (state.sizeMode === 'custom') {
    const n = document.getElementById('neck-size') ? document.getElementById('neck-size').value : '';
    const h = document.getElementById('height-size') ? document.getElementById('height-size').value : '';
    const sh = document.getElementById('shoulder-size') ? document.getElementById('shoulder-size').value : '';
    const sl = document.getElementById('sleeve-size') ? document.getElementById('sleeve-size').value : '';
    sizeText = `رقبة ${n || '—'}سم | طول ${h || '—'}سم | كتف ${sh || '—'}سم | أكمام ${sl || '—'}سم`;
  } else {
    sizeText = state.selectedSize || '—';
  }
  if (ms) ms.textContent = sizeText;

  const overlay = document.getElementById('orderModal');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const modalCard = overlay.querySelector('.modal-card');
    if (modalCard) modalCard.scrollTop = 0;
  }
}

function closeOrderModal() {
  const overlay = document.getElementById('orderModal');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

const orderModalEl = document.getElementById('orderModal');
if (orderModalEl) {
  orderModalEl.addEventListener('click', function(e) {
    if (e.target === this) closeOrderModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOrderModal();
});

/* ============================================================
   FORM SUBMISSION (WhatsApp Direct - البريد اختياري ورقم العميل محفوظ)
============================================================ */
function submitOrder(event) {
  if (event) event.preventDefault();
  const btn = document.getElementById('confirm-btn');
  if (btn && btn.disabled) return;

  const nameEl = document.getElementById('full-name');
  const phoneEl = document.getElementById('phone-number');
  const emailEl = document.getElementById('email-address');
  const notesEl = document.getElementById('notes');

  const customerName = (nameEl ? nameEl.value : '').trim();
  let customerPhone = (phoneEl ? phoneEl.value : '').trim();
  const customerEmail = (emailEl ? emailEl.value : '').trim(); // اختياري تماماً
  const notes = notesEl ? notesEl.value.trim() : '';

  customerPhone = customerPhone.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
                               .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

  if (!customerName) {
    showToast('يرجى كتابة الاسم', 'الاسم مطلوب لإتمام الطلب وتأكيد الحجز', true);
    if (nameEl) nameEl.focus();
    return;
  }

  const cleanPhone = customerPhone.replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    showToast('رقم الجوال غير مكتمل', 'يرجى إدخال رقم جوال صحيح للتواصل معك عبر واتساب', true);
    if (phoneEl) phoneEl.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (customerEmail && !emailRegex.test(customerEmail)) {
    showToast('البريد الإلكتروني غير صحيح', 'يرجى إدخال بريد صالح أو ترك الحقل فارغاً', true);
    if (emailEl) emailEl.focus();
    return;
  }

  let sizeText = '—';
  if (state.sizeMode === 'custom') {
    const n = document.getElementById('neck-size') ? document.getElementById('neck-size').value : '';
    const h = document.getElementById('height-size') ? document.getElementById('height-size').value : '';
    const sh = document.getElementById('shoulder-size') ? document.getElementById('shoulder-size').value : '';
    const sl = document.getElementById('sleeve-size') ? document.getElementById('sleeve-size').value : '';
    sizeText = `رقبة ${n || '—'}سم | طول ${h || '—'}سم | كتف ${sh || '—'}سم | أكمام ${sl || '—'}سم`;
  } else {
    sizeText = state.selectedSize || '—';
  }

  const whatsappMessage = 
    `*طلب تفصيل ثوب جديد (روح الثوب)* %0a` +
    `---------------------------------- %0a` +
    `👤 *الاسم:* ${customerName} %0a` +
    `📱 *رقم الجوال:* ${customerPhone} %0a` +
    `✉️ *البريد:* ${customerEmail || 'لم يتم الإدخال (اختياري)'} %0a` +
    `🧵 *القماش:* ${state.selectedFabricName || '—'} %0a` +
    `🎨 *اللون:* ${state.selectedColorName || '—'} %0a` +
    `📏 *المقاس:* ${sizeText} %0a` +
    `📝 *ملاحظات:* ${notes || 'لا توجد ملاحظات'} %0a` +
    `----------------------------------`;

  // 📌 ضعِي رقم واتساب متجرك الخاص هنا بالصيغة الدولية لاستقبال الطلبات:
  const storeWhatsAppNumber = "966500000000"; 

  closeOrderModal();
  document.body.style.overflow = '';
  const orderFormEl = document.getElementById('orderForm');
  if (orderFormEl) orderFormEl.reset();

  const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${whatsappMessage}`;
  window.open(whatsappUrl, '_blank');

  showToast('تم تجهيز طلبك بنجاح!', 'جاري تحويلك إلى الواتساب لإرسال الطلب');
}

function showToast(title = 'تم إرسال طلبك بنجاح!', subtitle = 'سيتواصل معك فريقنا خلال ٢٤ ساعة', isError = false) {
  const toast = document.getElementById('successToast');
  if (!toast) return;

  const iconEl = toast.querySelector('.toast-icon');
  const strongEl = toast.querySelector('.toast-text strong');
  const spanEl = toast.querySelector('.toast-text span');

  if (iconEl) iconEl.textContent = isError ? '✕' : '✓';
  if (strongEl) strongEl.textContent = title;
  if (spanEl) spanEl.textContent = subtitle;

  if (isError) {
    toast.classList.add('error');
  } else {
    toast.classList.remove('error');
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

function pulseSelection(el) {
  el.style.transform = 'scale(1.02)';
  setTimeout(() => { el.style.transform = ''; }, 300);
}

const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--gold-mid)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

const heroCta = document.getElementById('hero-cta');
if (heroCta) {
  heroCta.addEventListener('mouseenter', () => {
    heroCta.style.letterSpacing = '0.03em';
  });
  heroCta.addEventListener('mouseleave', () => {
    heroCta.style.letterSpacing = '';
  });
}

document.querySelectorAll('.fabric-card, .color-card').forEach(card => {
  card.setAttribute('tabindex', '0');
});

document.querySelectorAll('.measure-input').forEach(input => {
  input.addEventListener('blur', () => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      if (val < min) input.value = min;
      if (val > max) input.value = max;
    }
  });
});

const colorMap = {
  'off-white': '#FAF7F2',
  'bright-white': '#FFFFFF',
  'cream': '#FFFDD0',
  'soft-gold': '#F3E5AB',
  'charcoal': '#444444',
  'light-blue': '#B8D8F8'
};

document.querySelectorAll('.color-card').forEach(card => {
  card.addEventListener('click', () => {
    const color = colorMap[card.dataset.color];
    if (color) {
      const thobeGrad = document.getElementById('thobeGrad');
      if (thobeGrad) {
        thobeGrad.querySelectorAll('stop')[0].style.stopColor = color;
        thobeGrad.querySelectorAll('stop')[1].style.stopColor = shadeColor(color, -10);
      }
    }
  });
});

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

console.log('%c روح الثوب 🏆', 'color: #B8891B; font-size: 20px; font-weight: bold;');
console.log('%c أناقة تتجسد في تفاصيلك', 'color: #C69A2B; font-size: 14px;');

const confirmButtonEl = document.getElementById('confirm-btn');
if (confirmButtonEl) {
  confirmButtonEl.addEventListener('click', (e) => {
    if (!confirmButtonEl.disabled) {
      submitOrder(e);
    }
  });
});
