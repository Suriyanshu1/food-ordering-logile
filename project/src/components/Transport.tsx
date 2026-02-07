import { useState, useEffect, useRef } from 'react';
import { Car, Clock, MapPin, CheckCircle, ArrowLeft, Users, Route, Calendar, Settings, ChevronDown } from 'lucide-react';
import TransportAdmin from './TransportAdmin';

interface TransportProps { onBack: () => void; }

const TIMES = ['9:00 PM','10:00 PM','11:00 PM','12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','5:00 AM','6:00 AM'];
const ROUTES = ['Office-Patia-Cuttack','Office - Jatani','Office-Sahid nagar-Puri highway','Office-Sundarpada','Office-Silicon (For Interns only)','Office-KIIT-Patia (For Interns only)'];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${delay ? `reveal-delay-${delay}` : ''} ${className}`}>{children}</div>;
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const Tick = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

function Transport({ onBack }: TransportProps) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [formData, setFormData] = useState({
    transportDate:'', wantDropOff:'', shiftEndTime:'', gender:'',
    acknowledgement:false, route:'', shiftStartsAfter8pm:'', needCabPickup:'',
    pickupTime:'', pickupAddress:''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDateOff, setIsDateOff] = useState(false);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 50); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);

  const checkDate = (d: string) => { const now = new Date(), sel = new Date(d+'T00:00:00'), today = new Date(); today.setHours(0,0,0,0); if (sel.getTime()===today.getTime()){const c=new Date();c.setHours(17,0,0,0);return now>c;} return sel<today; };
  const handleDate = (d: string) => { setIsDateOff(checkDate(d)); setFormData({...formData, transportDate:d}); };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!formData.transportDate) e.transportDate = 'Select a date';
    if (formData.wantDropOff==='yes') { if (!formData.shiftEndTime) e.shiftEndTime='Select time'; if (!formData.gender) e.gender='Select gender'; if (!formData.acknowledgement) e.acknowledgement='Required'; if (!formData.route) e.route='Select route'; }
    if (formData.shiftStartsAfter8pm==='yes' && formData.needCabPickup==='yes') { if (!formData.pickupTime) e.pickupTime='Required'; if (!formData.pickupAddress) e.pickupAddress='Required'; }
    setErrors(e); return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!validate()) return; setIsSubmitting(true);
    try { console.log('Transport booked'); setShowSuccess(true); setTimeout(() => { setShowSuccess(false); setFormData({transportDate:'',wantDropOff:'',shiftEndTime:'',gender:'',acknowledgement:false,route:'',shiftStartsAfter8pm:'',needCabPickup:'',pickupTime:'',pickupAddress:''}); }, 3000); }
    catch(err) { console.error(err); alert('Failed. Try again.'); } finally { setIsSubmitting(false); }
  };

  if (showAdmin) return <TransportAdmin onBack={() => setShowAdmin(false)} />;

  return (
    <div className="min-h-screen font-sans">
      <div className="noise-overlay" />

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${navScrolled ? 'nav-scrolled' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-cream-500/50 hover:text-cream-300 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <div className="flex items-center gap-1">
            <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-cream-500/50 hover:text-cream-300 transition-colors">Food</button>
            <button className="px-4 py-2 text-sm font-medium text-blue-400">Transport</button>
            <button onClick={() => setShowAdmin(true)} className="px-4 py-2 text-sm font-medium text-cream-500/30 hover:text-cream-400 transition-colors flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-indigo-600/4 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="opacity-0 animate-fade-up mb-10">
            <div className="flex items-center justify-center gap-3 text-blue-400/50 text-[11px] tracking-[0.35em] uppercase font-medium">
              <span className="w-8 h-px bg-blue-400/20" />Logile<span className="w-8 h-px bg-blue-400/20" />
            </div>
          </div>
          <h1 className="opacity-0 animate-fade-up-d1 font-serif text-6xl md:text-8xl lg:text-[7.5rem] font-bold leading-[0.92] mb-7 tracking-tight">
            <span className="text-cream-200">Your</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-400">Ride</span>
          </h1>
          <p className="opacity-0 animate-fade-up-d2 text-base md:text-lg text-cream-500/40 font-light max-w-sm mx-auto mb-12 leading-relaxed tracking-wide">Employee transport booking, simplified.</p>
          <div className="opacity-0 animate-fade-up-d3">
            <button onClick={() => scrollTo('booking')} className="btn-blue text-sm tracking-wider uppercase inline-flex items-center gap-2.5">Book a Ride <ChevronDown className="w-4 h-4 opacity-60" /></button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up-d4">
          <div className="w-[18px] h-7 rounded-full border border-cream-500/10 flex justify-center"><div className="w-px h-2 bg-cream-500/20 rounded-full mt-1.5 animate-scroll-hint" /></div>
        </div>
      </section>

      {/* INFO */}
      <section className="py-28 px-6">
        <div className="divider-dark mb-28" />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[11px] font-medium text-blue-400/60 uppercase tracking-[0.25em] mb-3">Transport details</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-200 mb-16">How it works</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            <Reveal delay={1}><div className="lux-card p-8"><div className="w-11 h-11 rounded-xl bg-blue-500/8 flex items-center justify-center mb-6"><Car className="w-5 h-5 text-blue-400" /></div><h3 className="font-serif text-lg font-semibold text-cream-200 mb-2">Drop-off Service</h3><p className="text-sm text-cream-500/40 leading-relaxed">Available for all employees. Select your route and timing.</p></div></Reveal>
            <Reveal delay={2}><div className="lux-card p-8"><div className="w-11 h-11 rounded-xl bg-indigo-500/8 flex items-center justify-center mb-6"><MapPin className="w-5 h-5 text-indigo-400" /></div><h3 className="font-serif text-lg font-semibold text-cream-200 mb-2">CAB Pickup</h3><p className="text-sm text-cream-500/40 leading-relaxed">For shifts starting after 8 PM. Pickup from your location.</p></div></Reveal>
            <Reveal delay={3}><div className="lux-card p-8"><div className="w-11 h-11 rounded-xl bg-amber-500/8 flex items-center justify-center mb-6"><Clock className="w-5 h-5 text-amber-400" /></div><h3 className="font-serif text-lg font-semibold text-cream-200 mb-2">Booking Deadline</h3><p className="text-sm text-cream-500/40 leading-relaxed">Book by 5:00 PM same day for your transport service.</p></div></Reveal>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="booking" className="pb-32 px-6">
        <div className="divider-dark mb-28" />
        <div className="relative">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <Reveal>
            <div className="mb-14">
              <p className="text-[11px] font-medium text-blue-400/60 uppercase tracking-[0.25em] mb-3">Booking Form</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-200 mb-2">Book Your Ride</h2>
              <p className="text-cream-500/40 text-sm">Fill in the details below to schedule your transport.</p>
            </div>
          </Reveal>

          <form onSubmit={submit} className="space-y-6">
            {/* Date */}
            <Reveal delay={1}>
              <div className="lux-card-static p-7">
                <div className="flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-blue-400" /><p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em]">Date <span className="text-red-400/70">*</span></p></div>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.transportDate} onChange={e => handleDate(e.target.value)} className={`input-dark input-dark-blue ${isDateOff?'opacity-50':''}`} />
                {isDateOff && <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Booking closed (deadline: 5 PM)</p>}
                {errors.transportDate && <p className="mt-2 text-xs text-red-400">{errors.transportDate}</p>}
              </div>
            </Reveal>

            {/* Drop-off */}
            <Reveal delay={1}>
              <div className="lux-card-static p-7 space-y-6">
                <div className="flex items-center gap-2"><Car className="w-4 h-4 text-blue-400" /><p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em]">Drop-off</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({...formData, wantDropOff:'yes'})} className={`text-center py-3.5 ${formData.wantDropOff==='yes'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200">Yes, I need drop-off</span></button>
                  <button type="button" onClick={() => setFormData({...formData, wantDropOff:'no',shiftEndTime:'',gender:'',acknowledgement:false,route:''})} className={`text-center py-3.5 ${formData.wantDropOff==='no'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200">No, thanks</span></button>
                </div>
                {formData.wantDropOff==='yes' && (
                  <div className="space-y-5 animate-slide-down">
                    <div><label className="block text-sm font-medium text-cream-300 mb-2">Shift Ending Time <span className="text-red-400/70">*</span></label><div className="relative"><select value={formData.shiftEndTime} onChange={e => setFormData({...formData, shiftEndTime:e.target.value})} className="input-dark input-dark-blue appearance-none cursor-pointer pr-10"><option value="">Select time</option>{TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500/30 pointer-events-none" /></div>{errors.shiftEndTime && <p className="mt-1.5 text-xs text-red-400">{errors.shiftEndTime}</p>}</div>
                    <div><label className="block text-sm font-medium text-cream-300 mb-2">Gender <span className="text-red-400/70">*</span></label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setFormData({...formData,gender:'male'})} className={`text-center py-3 ${formData.gender==='male'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200 flex items-center justify-center gap-2"><Users className="w-4 h-4" /> Male</span></button><button type="button" onClick={() => setFormData({...formData,gender:'female'})} className={`text-center py-3 ${formData.gender==='female'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200 flex items-center justify-center gap-2"><Users className="w-4 h-4" /> Female</span></button></div>{errors.gender && <p className="mt-1.5 text-xs text-red-400">{errors.gender}</p>}</div>
                    <div><label className="block text-sm font-medium text-cream-300 mb-2"><Route className="w-3.5 h-3.5 inline mr-1.5" />Route <span className="text-red-400/70">*</span></label><div className="relative"><select value={formData.route} onChange={e => setFormData({...formData, route:e.target.value})} className="input-dark input-dark-blue appearance-none cursor-pointer pr-10"><option value="">Select route</option>{ROUTES.map(r=><option key={r} value={r}>{r}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500/30 pointer-events-none" /></div>{errors.route && <p className="mt-1.5 text-xs text-red-400">{errors.route}</p>}</div>
                    <div className="lux-card-static p-5 bg-white/[0.015]"><label className="flex items-start gap-3 cursor-pointer group"><div className="relative mt-0.5"><input type="checkbox" checked={formData.acknowledgement} onChange={e => setFormData({...formData, acknowledgement:e.target.checked})} className="sr-only" /><div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${formData.acknowledgement?'bg-blue-500 border-blue-500':'border-white/10 group-hover:border-blue-400/50'}`}>{formData.acknowledgement && <Tick />}</div></div><div><span className="text-sm font-medium text-cream-200 block">Acknowledgement</span><span className="text-xs text-cream-500/35 leading-relaxed">I confirm I will be ready at the scheduled time and agree to transport guidelines.</span></div></label>{errors.acknowledgement && <p className="mt-2 text-xs text-red-400">{errors.acknowledgement}</p>}</div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Pickup */}
            <Reveal delay={1}>
              <div className="lux-card-static p-7 space-y-6">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /><p className="text-[11px] font-medium text-cream-500/30 uppercase tracking-[0.2em]">CAB Pickup</p></div>
                <div><label className="block text-sm font-medium text-cream-300 mb-3">Does your shift start after 8 PM?</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setFormData({...formData, shiftStartsAfter8pm:'yes'})} className={`text-center py-3 ${formData.shiftStartsAfter8pm==='yes'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200">Yes</span></button><button type="button" onClick={() => setFormData({...formData, shiftStartsAfter8pm:'no',needCabPickup:'',pickupTime:'',pickupAddress:''})} className={`text-center py-3 ${formData.shiftStartsAfter8pm==='no'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200">No</span></button></div></div>
                {formData.shiftStartsAfter8pm==='yes' && (
                  <div className="space-y-5 animate-slide-down">
                    <div><label className="block text-sm font-medium text-cream-300 mb-3">Need CAB pickup?</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setFormData({...formData, needCabPickup:'yes'})} className={`text-center py-3 ${formData.needCabPickup==='yes'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200">Yes</span></button><button type="button" onClick={() => setFormData({...formData, needCabPickup:'no',pickupTime:'',pickupAddress:''})} className={`text-center py-3 ${formData.needCabPickup==='no'?'opt-card opt-card-active-blue':'opt-card'}`}><span className="text-sm font-medium text-cream-200">No</span></button></div></div>
                    {formData.needCabPickup==='yes' && (
                      <div className="space-y-5 animate-slide-down">
                        <div><label className="block text-sm font-medium text-cream-300 mb-2"><Clock className="w-3.5 h-3.5 inline mr-1.5" />Pickup Time <span className="text-red-400/70">*</span></label><input type="text" value={formData.pickupTime} onChange={e => setFormData({...formData, pickupTime:e.target.value})} placeholder="e.g., 8:30 PM" className="input-dark input-dark-blue" />{errors.pickupTime && <p className="mt-1.5 text-xs text-red-400">{errors.pickupTime}</p>}</div>
                        <div><label className="block text-sm font-medium text-cream-300 mb-2"><MapPin className="w-3.5 h-3.5 inline mr-1.5" />Pickup Address <span className="text-red-400/70">*</span></label><textarea value={formData.pickupAddress} onChange={e => setFormData({...formData, pickupAddress:e.target.value})} placeholder="Complete address" rows={3} className="input-dark input-dark-blue resize-none" />{errors.pickupAddress && <p className="mt-1.5 text-xs text-red-400">{errors.pickupAddress}</p>}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal>
              <button type="submit" disabled={isSubmitting||isDateOff} className="w-full btn-blue text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSubmitting ? (<><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Booking...</>) : (<><Car className="w-5 h-5" /> Book Transport</>)}
              </button>
            </Reveal>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6"><div className="divider-dark mb-16" /><div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"><img src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840" alt="Logile" className="h-5 brightness-0 invert opacity-20" /><p className="text-xs text-cream-500/25">&copy; {new Date().getFullYear()} Logile. Employee Transport Booking.</p></div></footer>

      {/* SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="lux-card-static p-10 max-w-sm text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
            <h3 className="font-serif text-2xl font-bold text-cream-200 mb-2">Booking Confirmed</h3>
            <p className="text-sm text-cream-500/40 leading-relaxed">Your transport has been booked successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transport;
