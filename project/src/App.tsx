import { useState, useEffect, useRef, useCallback } from 'react';
import { Utensils, Clock, IndianRupee, CheckCircle, Settings, ChevronDown, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { MEAL_PRICES, MealPreference, LunchType } from './types';
import Admin from './components/Admin';
import Transport from './components/Transport';

type DinnerType = 'roti_only' | 'roti_rice_combined' | 'none';

// ─── Scroll Reveal ─────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${delay ? `reveal-delay-${delay}` : ''} ${className}`}>{children}</div>;
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const Tick = () => (
  <svg className="w-3.5 h-3.5 text-charcoal-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════
function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTransport, setShowTransport] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const [formData, setFormData] = useState({
    userName: '', userEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    mealType: [] as string[],
    lunchPreference: 'none' as MealPreference, lunchType: 'none' as LunchType,
    dinnerPreference: 'none' as MealPreference, dinnerType: 'none' as DinnerType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkAllowed = useCallback((meal: 'lunch' | 'dinner', date: string) => {
    const now = new Date(), d = new Date(date + 'T00:00:00');
    if (meal === 'lunch') { const dl = new Date(d); dl.setDate(dl.getDate() - 1); dl.setHours(21, 0, 0, 0); return now <= dl; }
    const dl = new Date(d); dl.setHours(16, 30, 0, 0); return now <= dl;
  }, []);

  const isLunch = checkAllowed('lunch', formData.orderDate);
  const isDinner = checkAllowed('dinner', formData.orderDate);
  const toggleMeal = (m: string) => setFormData(p => ({ ...p, mealType: p.mealType.includes(m) ? p.mealType.filter(x => x !== m) : [...p.mealType, m] }));

  const total = (() => {
    let t = 0;
    if (formData.mealType.includes('lunch') && formData.lunchPreference !== 'none') t += MEAL_PRICES[formData.lunchPreference];
    if (formData.mealType.includes('dinner') && formData.dinnerPreference !== 'none') t += MEAL_PRICES[formData.dinnerPreference];
    return t;
  })();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.userName.trim()) e.userName = 'Name is required';
    if (!formData.userEmail.trim() || !formData.userEmail.includes('@')) e.userEmail = 'Valid email is required';
    if (!formData.mealType.length) e.mealType = 'Select at least one meal';
    if (formData.mealType.includes('lunch') && formData.lunchPreference === 'none') e.lunchPreference = 'Select preference';
    if (formData.mealType.includes('lunch') && formData.lunchPreference !== 'none' && formData.lunchType === 'none') e.lunchType = 'Select type';
    if (formData.mealType.includes('dinner') && formData.dinnerPreference === 'none') e.dinnerPreference = 'Select preference';
    if (formData.mealType.includes('dinner') && formData.dinnerPreference !== 'none' && formData.dinnerType === 'none') e.dinnerType = 'Select type';
    setErrors(e); return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!validate()) return;
    setIsSubmitting(true);
    try {
      const lp = formData.mealType.includes('lunch') && formData.lunchPreference !== 'none' ? MEAL_PRICES[formData.lunchPreference] : 0;
      const dp = formData.mealType.includes('dinner') && formData.dinnerPreference !== 'none' ? MEAL_PRICES[formData.dinnerPreference] : 0;
      const { error } = await supabase.from('food_orders').insert({
        user_name: formData.userName, user_email: formData.userEmail, order_date: formData.orderDate,
        meal_type: formData.mealType.join(', '), lunch_preference: formData.lunchPreference,
        lunch_type: formData.lunchType, dinner_preference: formData.dinnerPreference,
        dinner_type: formData.dinnerType, lunch_price: lp, dinner_price: dp, total_price: lp + dp,
      });
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setFormData({ userName:'',userEmail:'',orderDate:new Date().toISOString().split('T')[0],mealType:[],lunchPreference:'none',lunchType:'none',dinnerPreference:'none',dinnerType:'none' }); }, 3000);
    } catch (err) { console.error(err); alert('Failed to submit. Try again.'); }
    finally { setIsSubmitting(false); }
  };

  if (showAdmin) return <Admin onBack={() => setShowAdmin(false)} />;
  if (showTransport) return <Transport onBack={() => setShowTransport(false)} />;

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="noise-overlay" />
        <div className="lux-card-static p-12 max-w-lg text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-xl font-serif font-bold text-cream-100 mb-2">Configuration Required</h1>
          <p className="text-sm text-cream-500 leading-relaxed">Add <code className="text-gold-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">VITE_SUPABASE_URL</code> and <code className="text-gold-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">VITE_SUPABASE_ANON_KEY</code> to GitHub Secrets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="noise-overlay" />

      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${navScrolled ? 'nav-scrolled' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840" alt="Logile" className="h-5 brightness-0 invert opacity-50" />
          <div className="flex items-center gap-1">
            <button className="px-4 py-2 text-sm font-medium text-gold-400">Food</button>
            <button onClick={() => setShowTransport(true)} className="px-4 py-2 text-sm font-medium text-cream-500/60 hover:text-cream-300 transition-colors">Transport</button>
            <button onClick={() => setShowAdmin(true)} className="px-4 py-2 text-sm font-medium text-cream-500/40 hover:text-cream-400 transition-colors flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-gold-600/6 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px] bg-gold-700/4 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-gold-500/3 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="opacity-0 animate-fade-up mb-10">
            <div className="ornament text-gold-500/70 text-[11px] tracking-[0.35em] uppercase font-medium">
              Logile
            </div>
          </div>

          <h1 className="opacity-0 animate-fade-up-d1 font-serif text-6xl md:text-8xl lg:text-[7.5rem] font-bold leading-[0.92] mb-7 tracking-tight">
            <span className="text-cream-200">Fine</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600">Dining</span>
          </h1>

          <p className="opacity-0 animate-fade-up-d2 text-base md:text-lg text-cream-500/50 font-light max-w-sm mx-auto mb-12 leading-relaxed tracking-wide">
            Employee meal ordering, elevated.
          </p>

          <div className="opacity-0 animate-fade-up-d3">
            <button onClick={() => scrollTo('order')} className="btn-gold text-sm tracking-wider inline-flex items-center gap-2.5 uppercase">
              Place Your Order
              <ChevronDown className="w-4 h-4 opacity-60" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up-d4">
          <div className="w-[18px] h-7 rounded-full border border-cream-500/15 flex justify-center">
            <div className="w-px h-2 bg-cream-500/25 rounded-full mt-1.5 animate-scroll-hint" />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 px-6">
        <div className="divider-dark mb-28" />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[11px] font-medium text-gold-500/70 uppercase tracking-[0.25em] mb-3">How it works</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-200 mb-16">Everything you need to know</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            <Reveal delay={1}>
              <div className="lux-card p-8">
                <div className="w-11 h-11 rounded-xl bg-gold-500/8 flex items-center justify-center mb-6">
                  <IndianRupee className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-cream-200 mb-2">Food Charges</h3>
                <p className="text-sm text-cream-500/45 leading-relaxed">Borne by employees on actuals. Payment collected at end of month.</p>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div className="lux-card p-8">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/8 flex items-center justify-center mb-6">
                  <Utensils className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-cream-200 mb-2">Admin Costs</h3>
                <p className="text-sm text-cream-500/45 leading-relaxed">All administrative and operational costs are covered by the company.</p>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="lux-card p-8">
                <div className="w-11 h-11 rounded-xl bg-blue-500/8 flex items-center justify-center mb-6">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-cream-200 mb-2">Dinner Timing</h3>
                <p className="text-sm text-cream-500/45 leading-relaxed">Dinner is served daily between 8:30 PM and 9:00 PM.</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={4}>
            <div className="mt-10 lux-card-static px-7 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span className="text-sm text-cream-500/40"><span className="font-medium text-cream-300">Lunch</span> — order by 9 PM previous day</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/5" />
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                <span className="text-sm text-cream-500/40"><span className="font-medium text-cream-300">Dinner</span> — order by 4:30 PM same day</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── ORDER FORM ─── */}
      <section id="order" className="pb-32 px-6">
        <div className="divider-dark mb-28" />

        {/* Ambient glow */}
        <div className="relative">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-600/3 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Reveal>
            <div className="mb-14">
              <p className="text-[11px] font-medium text-gold-500/70 uppercase tracking-[0.25em] mb-3">Order Form</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-200 mb-2">Place Your Order</h2>
              <p className="text-cream-500/40 text-sm">Fill in the details below to reserve your meal.</p>
            </div>
          </Reveal>

          <form onSubmit={submit} className="space-y-6">
            {/* Personal */}
            <Reveal delay={1}>
              <div className="lux-card-static p-7 space-y-5">
                <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em]">Personal Info</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cream-300 mb-2">Name <span className="text-red-400/70">*</span></label>
                    <input type="text" value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })} className="input-dark" placeholder="Your full name" />
                    {errors.userName && <p className="mt-1.5 text-xs text-red-400">{errors.userName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream-300 mb-2">Email <span className="text-red-400/70">*</span></label>
                    <input type="email" value={formData.userEmail} onChange={e => setFormData({ ...formData, userEmail: e.target.value })} className="input-dark" placeholder="you@logile.com" />
                    {errors.userEmail && <p className="mt-1.5 text-xs text-red-400">{errors.userEmail}</p>}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Date */}
            <Reveal delay={1}>
              <div className="lux-card-static p-7">
                <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em] mb-4">Order Date</p>
                <input type="date" value={formData.orderDate} onChange={e => setFormData({ ...formData, orderDate: e.target.value })} className="input-dark" />
              </div>
            </Reveal>

            {/* Meal selection */}
            <Reveal delay={1}>
              <div className="lux-card-static p-7">
                <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em] mb-5">Select Meals <span className="text-red-400/70">*</span></p>
                <div className="space-y-3">
                  <button type="button" disabled={!isLunch} onClick={() => toggleMeal('lunch')}
                    className={`w-full text-left ${formData.mealType.includes('lunch') ? 'opt-card opt-card-active' : 'opt-card'} ${!isLunch ? 'opacity-35 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.mealType.includes('lunch') ? 'bg-gold-400 border-gold-400' : 'border-white/10'}`}>
                          {formData.mealType.includes('lunch') && <Tick />}
                        </div>
                        <span className="font-medium text-cream-200">Lunch</span>
                      </div>
                      {!isLunch && <span className="text-xs text-red-400/60">Deadline passed</span>}
                    </div>
                  </button>

                  <button type="button" disabled={!isDinner} onClick={() => toggleMeal('dinner')}
                    className={`w-full text-left ${formData.mealType.includes('dinner') ? 'opt-card opt-card-active' : 'opt-card'} ${!isDinner ? 'opacity-35 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.mealType.includes('dinner') ? 'bg-gold-400 border-gold-400' : 'border-white/10'}`}>
                          {formData.mealType.includes('dinner') && <Tick />}
                        </div>
                        <span className="font-medium text-cream-200">Dinner</span>
                      </div>
                      {!isDinner && <span className="text-xs text-red-400/60">Deadline passed</span>}
                    </div>
                  </button>

                  <div className="opt-card opacity-20 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md border-2 border-white/8" />
                      <span className="text-cream-500/50 text-sm">Snacks <span className="text-xs">(coming soon)</span></span>
                    </div>
                  </div>
                </div>
                {errors.mealType && <p className="mt-3 text-xs text-red-400">{errors.mealType}</p>}
              </div>
            </Reveal>

            {/* ── Lunch ── */}
            {formData.mealType.includes('lunch') && (
              <div className="lux-card-static p-7 animate-slide-down space-y-6">
                <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em]">Lunch Preference <span className="text-red-400/70">*</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(MEAL_PRICES).map(([k, v]) => (
                    <button key={k} type="button" onClick={() => setFormData({ ...formData, lunchPreference: k as MealPreference })}
                      className={`text-left ${formData.lunchPreference === k ? 'opt-card opt-card-active' : 'opt-card'}`}>
                      <span className={`block font-medium capitalize ${k === 'none' ? 'text-cream-500/40 text-sm' : 'text-cream-200'}`}>{k === 'none' ? 'Skip' : k}</span>
                      {k !== 'none' && <span className="text-xs text-gold-400/80 mt-0.5 block font-medium">₹{v}</span>}
                    </button>
                  ))}
                </div>
                {errors.lunchPreference && <p className="text-xs text-red-400">{errors.lunchPreference}</p>}
                {formData.lunchPreference !== 'none' && (
                  <div className="animate-slide-down">
                    <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em] mb-3">Meal Type <span className="text-red-400/70">*</span></p>
                    <div className="grid grid-cols-2 gap-3">
                      {(['roti_only','roti_rice_combined'] as const).map(t => (
                        <button key={t} type="button" onClick={() => setFormData({ ...formData, lunchType: t })}
                          className={`text-center ${formData.lunchType === t ? 'opt-card opt-card-active' : 'opt-card'}`}>
                          <span className="text-sm font-medium text-cream-300">{t === 'roti_only' ? 'Only Roti' : 'Roti & Rice'}</span>
                        </button>
                      ))}
                    </div>
                    {errors.lunchType && <p className="mt-2 text-xs text-red-400">{errors.lunchType}</p>}
                  </div>
                )}
              </div>
            )}

            {/* ── Dinner ── */}
            {formData.mealType.includes('dinner') && (
              <div className="lux-card-static p-7 animate-slide-down space-y-6">
                <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em]">Dinner Preference <span className="text-red-400/70">*</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(MEAL_PRICES).map(([k, v]) => (
                    <button key={k} type="button" onClick={() => setFormData({ ...formData, dinnerPreference: k as MealPreference })}
                      className={`text-left ${formData.dinnerPreference === k ? 'opt-card opt-card-active' : 'opt-card'}`}>
                      <span className={`block font-medium capitalize ${k === 'none' ? 'text-cream-500/40 text-sm' : 'text-cream-200'}`}>{k === 'none' ? 'Skip' : k}</span>
                      {k !== 'none' && <span className="text-xs text-gold-400/80 mt-0.5 block font-medium">₹{v}</span>}
                    </button>
                  ))}
                </div>
                {errors.dinnerPreference && <p className="text-xs text-red-400">{errors.dinnerPreference}</p>}
                {formData.dinnerPreference !== 'none' && (
                  <div className="animate-slide-down">
                    <p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em] mb-3">Meal Type <span className="text-red-400/70">*</span></p>
                    <div className="grid grid-cols-2 gap-3">
                      {(['roti_only','roti_rice_combined'] as const).map(t => (
                        <button key={t} type="button" onClick={() => setFormData({ ...formData, dinnerType: t })}
                          className={`text-center ${formData.dinnerType === t ? 'opt-card opt-card-active' : 'opt-card'}`}>
                          <span className="text-sm font-medium text-cream-300">{t === 'roti_only' ? 'Only Roti' : 'Roti & Rice'}</span>
                        </button>
                      ))}
                    </div>
                    {errors.dinnerType && <p className="mt-2 text-xs text-red-400">{errors.dinnerType}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Total */}
            {total > 0 && (
              <Reveal>
                <div className="lux-card-static p-7 bg-gradient-to-r from-gold-600/5 to-gold-700/3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cream-500/40 font-medium">Total Amount</span>
                    <span className="text-3xl font-serif font-bold text-gold-400 animate-price-pop">₹{total}</span>
                  </div>
                  <p className="text-xs text-cream-500/25 mt-1">Payment collected at end of month</p>
                </div>
              </Reveal>
            )}

            {/* Submit */}
            <Reveal>
              <button type="submit" disabled={isSubmitting} className="w-full btn-gold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSubmitting ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Submitting...</>
                ) : (
                  <><Utensils className="w-5 h-5" /> Submit Order</>
                )}
              </button>
            </Reveal>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-6">
        <div className="divider-dark mb-16" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840" alt="Logile" className="h-5 brightness-0 invert opacity-20" />
          <p className="text-xs text-cream-500/25">&copy; {new Date().getFullYear()} Logile. Employee Meal Ordering System.</p>
        </div>
      </footer>

      {/* Mobile price bar */}
      {total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal-950/90 backdrop-blur-xl border-t border-white/5 py-3 px-6 md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm text-cream-500/40">Total: <span className="text-gold-400 font-serif font-bold text-lg">₹{total}</span></span>
            <button onClick={() => document.querySelector('button[type="submit"]')?.scrollIntoView({ behavior: 'smooth' })} className="btn-gold text-xs py-2.5 px-5 tracking-wider uppercase">Submit</button>
          </div>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="lux-card-static p-10 max-w-sm text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-cream-200 mb-2">Order Placed</h3>
            <p className="text-sm text-cream-500/40 leading-relaxed">Your meal has been confirmed successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
