import { useState, useEffect } from 'react';
import { Car, Clock, MapPin, CheckCircle, ArrowLeft, Users, Route, Calendar, Settings } from 'lucide-react';
import TransportAdmin from './TransportAdmin';
// import { supabase } from '../lib/supabase'; // Uncomment when database is ready

interface TransportProps {
  onBack: () => void;
}

const SHIFT_END_TIMES = [
  '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', 
  '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'
];

const ROUTES = [
  'Office-Patia-Cuttack',
  'Office - Jatani',
  'Office-Sahid nagar-Puri highway',
  'Office-Sundarpada',
  'Office-Silicon (For Interns only)',
  'Office-KIIT-Patia (For Interns only)'
];

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Supercar component - uses CSS variables for smooth animation
const SuperCar = () => {
  return (
    <div 
      id="supercar"
      className="absolute bottom-28 z-20"
      style={{ 
        left: '5vw',
        willChange: 'transform',
      }}
    >
      <svg 
        width="200" 
        height="80" 
        viewBox="0 0 200 80" 
        style={{
          filter: `drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5)) drop-shadow(0 5px 15px rgba(59, 130, 246, 0.3))`,
        }}
      >
        <defs>
          <linearGradient id="carBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="40%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="carWindow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <radialGradient id="wheel" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="60%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </radialGradient>
          <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="100%" stopColor="#fbbf24" />
          </radialGradient>
          <radialGradient id="taillight2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#ef4444" />
          </radialGradient>
        </defs>
        
        <ellipse cx="100" cy="75" rx="85" ry="5" fill="rgba(0,0,0,0.3)" />
        
        <path 
          d="M15 50 L25 50 L35 35 L55 28 L75 25 L125 25 L145 28 L165 35 L175 50 L185 50 L185 55 L175 55 L175 58 L155 58 L155 55 L45 55 L45 58 L25 58 L25 55 L15 55 Z" 
          fill="url(#carBody)"
        />
        
        <path d="M55 35 L70 20 L130 20 L145 35 Z" fill="url(#carBody)" />
        <path d="M58 33 L72 22 L95 22 L95 33 Z" fill="url(#carWindow)" />
        <path d="M105 22 L128 22 L142 33 L105 33 Z" fill="url(#carWindow)" />
        <rect x="95" y="22" width="10" height="11" fill="#1e40af" />
        <path d="M55 28 L165 35" stroke="#1e3a5f" strokeWidth="0.5" fill="none" />
        <path d="M30 45 L170 45" stroke="#1e3a5f" strokeWidth="0.5" fill="none" />
        <rect x="70" y="40" width="15" height="8" rx="2" fill="#0f172a" />
        <rect x="95" y="38" width="12" height="2" rx="1" fill="#60a5fa" />
        <ellipse cx="178" cy="45" rx="4" ry="6" fill="url(#headlight)" />
        <ellipse cx="178" cy="45" rx="2" ry="3" fill="#fef9c3" />
        <rect x="18" y="42" width="4" height="8" rx="1" fill="url(#taillight2)" />
        <rect x="175" y="48" width="8" height="5" rx="1" fill="#1f2937" />
        
        {/* Wheels with CSS animation for rotation */}
        <g className="wheel-spin" style={{ transformOrigin: '155px 58px' }}>
          <circle cx="155" cy="58" r="14" fill="url(#wheel)" />
          <circle cx="155" cy="58" r="10" fill="#1f2937" />
          <circle cx="155" cy="58" r="4" fill="#4b5563" />
          <line x1="155" y1="48" x2="155" y2="68" stroke="#4b5563" strokeWidth="2" />
          <line x1="145" y1="58" x2="165" y2="58" stroke="#4b5563" strokeWidth="2" />
          <line x1="148" y1="51" x2="162" y2="65" stroke="#4b5563" strokeWidth="2" />
          <line x1="148" y1="65" x2="162" y2="51" stroke="#4b5563" strokeWidth="2" />
        </g>
        
        <g className="wheel-spin" style={{ transformOrigin: '45px 58px' }}>
          <circle cx="45" cy="58" r="14" fill="url(#wheel)" />
          <circle cx="45" cy="58" r="10" fill="#1f2937" />
          <circle cx="45" cy="58" r="4" fill="#4b5563" />
          <line x1="45" y1="48" x2="45" y2="68" stroke="#4b5563" strokeWidth="2" />
          <line x1="35" y1="58" x2="55" y2="58" stroke="#4b5563" strokeWidth="2" />
          <line x1="38" y1="51" x2="52" y2="65" stroke="#4b5563" strokeWidth="2" />
          <line x1="38" y1="65" x2="52" y2="51" stroke="#4b5563" strokeWidth="2" />
        </g>
        
        <path d="M30 55 Q45 45 60 55" fill="none" stroke="#1e3a5f" strokeWidth="1" />
        <path d="M140 55 Q155 45 170 55" fill="none" stroke="#1e3a5f" strokeWidth="1" />
        <ellipse cx="18" cy="53" rx="2" ry="1.5" fill="#374151" />
      </svg>
      
      {/* Exhaust smoke - pure CSS animation */}
      <div className="absolute -left-2 bottom-5 flex space-x-0.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 bg-gray-400 rounded-full animate-exhaust"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0.2 - i * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
};

// Road with pure CSS animation - no JavaScript updates
const AnimatedRoad = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700" />
      
      {/* Road lines with pure CSS infinite animation */}
      <div className="road-lines-container absolute bottom-8 left-0 h-2 flex items-center">
        <div className="road-lines flex items-center">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="w-16 h-1.5 bg-yellow-400 rounded-sm flex-shrink-0 mx-6"
              style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}
            />
          ))}
        </div>
        <div className="road-lines flex items-center">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i + 30} 
              className="w-16 h-1.5 bg-yellow-400 rounded-sm flex-shrink-0 mx-6"
              style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-white opacity-40" />
      <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-white opacity-40" />
    </div>
  );
};

function Transport({ onBack }: TransportProps) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [formData, setFormData] = useState({
    transportDate: '',
    wantDropOff: '',
    shiftEndTime: '',
    gender: '',
    acknowledgement: false,
    route: '',
    shiftStartsAfter8pm: '',
    needCabPickup: '',
    pickupTime: '',
    pickupAddress: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  
  // Direct DOM manipulation for 60fps car animation
  useEffect(() => {
    let ticking = false;
    let currentX = 5; // Starting position in vw
    const maxScroll = 400;
    
    const updateCarPosition = () => {
      const car = document.getElementById('supercar');
      if (car) {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / maxScroll, 1);
        const targetX = 5 + (progress * 85);
        
        // Smooth lerp
        currentX += (targetX - currentX) * 0.15;
        
        car.style.transform = `translateX(calc(${currentX}vw - 100px))`;
      }
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateCarPosition);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const checkDateAvailability = (selectedDate: string) => {
    const now = new Date();
    const selected = new Date(selectedDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selected.getTime() === today.getTime()) {
      const cutoffTime = new Date();
      cutoffTime.setHours(17, 0, 0, 0);
      return now > cutoffTime;
    }
    
    if (selected < today) {
      return true;
    }
    
    return false;
  };

  const handleDateChange = (date: string) => {
    const disabled = checkDateAvailability(date);
    setIsDateDisabled(disabled);
    setFormData({ ...formData, transportDate: date });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.transportDate) {
      newErrors.transportDate = 'Please select a transport date';
    }

    if (formData.wantDropOff === 'yes') {
      if (!formData.shiftEndTime) {
        newErrors.shiftEndTime = 'Please select shift ending time';
      }
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
      if (!formData.acknowledgement) {
        newErrors.acknowledgement = 'Please accept the acknowledgement';
      }
      if (!formData.route) {
        newErrors.route = 'Please select your route';
      }
    }

    if (formData.shiftStartsAfter8pm === 'yes' && formData.needCabPickup === 'yes') {
      if (!formData.pickupTime) {
        newErrors.pickupTime = 'Please mention your pickup time';
      }
      if (!formData.pickupAddress) {
        newErrors.pickupAddress = 'Please mention your pickup address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare bookings data
      const bookings = [];
      
      // Add drop-off booking if selected
      if (formData.wantDropOff === 'yes') {
        bookings.push({
          user_name: '', // Will be filled from user input or session
          user_email: '', // Will be filled from user input or session
          booking_date: formData.transportDate,
          booking_type: 'dropoff',
          shift_end_time: formData.shiftEndTime,
          gender: formData.gender,
          route: formData.route,
        });
      }
      
      // Add pickup booking if selected
      if (formData.shiftStartsAfter8pm === 'yes' && formData.needCabPickup === 'yes') {
        bookings.push({
          user_name: '', // Will be filled from user input or session
          user_email: '', // Will be filled from user input or session
          booking_date: formData.transportDate,
          booking_type: 'pickup',
          pickup_time: formData.pickupTime,
          pickup_address: formData.pickupAddress,
        });
      }

      // For now, log the data (in production, you'd save to supabase)
      console.log('Transport booking submitted:', bookings);
      
      // Uncomment below when the table is created in supabase:
      // for (const booking of bookings) {
      //   const { error } = await supabase.from('transport_bookings').insert(booking);
      //   if (error) throw error;
      // }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          transportDate: '',
          wantDropOff: '',
          shiftEndTime: '',
          gender: '',
          acknowledgement: false,
          route: '',
          shiftStartsAfter8pm: '',
          needCabPickup: '',
          pickupTime: '',
          pickupAddress: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting transport booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (showAdmin) {
    return <TransportAdmin onBack={() => setShowAdmin(false)} />;
  }

  // Custom select styles for dark theme
  const selectClassName = "w-full px-6 py-4 bg-slate-900 border border-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white appearance-none cursor-pointer hover:border-blue-400";

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.1}px)`
          }} />
        </div>

        {/* City Skyline */}
        <div 
          className="absolute bottom-32 left-0 right-0 h-40 opacity-20"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          <svg viewBox="0 0 1400 120" className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M0 120 L0 100 L30 100 L30 70 L50 70 L50 85 L80 85 L80 55 L100 55 L100 100 L130 100 L130 45 L150 45 L150 30 L170 30 L170 45 L190 45 L190 100 L230 100 L230 60 L250 60 L250 100 L290 100 L290 50 L310 50 L310 35 L330 35 L330 50 L350 50 L350 100 L390 100 L390 70 L420 70 L420 100 L450 100 L450 55 L470 55 L470 40 L490 40 L490 55 L510 55 L510 100 L550 100 L550 75 L580 75 L580 100 L610 100 L610 60 L640 60 L640 100 L680 100 L680 50 L720 50 L720 100 L750 100 L750 45 L780 45 L780 100 L810 100 L810 65 L850 65 L850 100 L880 100 L880 55 L920 55 L920 100 L950 100 L950 70 L990 70 L990 100 L1020 100 L1020 50 L1060 50 L1060 100 L1100 100 L1100 80 L1140 80 L1140 100 L1180 100 L1180 60 L1220 60 L1220 100 L1260 100 L1260 75 L1300 75 L1300 100 L1350 100 L1350 90 L1400 90 L1400 120 Z" 
              fill="currentColor"
              className="text-blue-400"
            />
          </svg>
        </div>

        <AnimatedRoad />
        <SuperCar />

        {/* Navigation */}
        <nav className="relative z-30 flex items-center justify-between px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Food Ordering</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdmin(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all font-medium border border-slate-600"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <img
              src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840"
              alt="Logile"
              className="h-8 filter brightness-0 invert"
            />
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 -mt-32">
          <div className="animate-hero-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400">
              Transport
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-gray-300 mb-8">
              Employee Transport Booking System
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
              Book your daily office commute quickly and easily
            </p>
            
            <button 
              onClick={() => smoothScrollTo('booking')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span>Book Now</span>
              <Car className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-scroll-indicator" />
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div id="booking" className="relative py-20 bg-gradient-to-b from-slate-900 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Ride</h2>
            <p className="text-lg text-gray-400">Fill in the details below to schedule your transport</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Transport Date */}
            <div className="group">
              <label className="flex items-center space-x-2 text-lg font-semibold mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Select Date of Transport</span>
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={getMinDate()}
                  value={formData.transportDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`w-full px-6 py-4 bg-slate-900 border ${
                    isDateDisabled ? 'border-red-500/50 opacity-50' : 'border-slate-500'
                  } rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg`}
                />
                {isDateDisabled && (
                  <p className="mt-2 text-red-400 text-sm flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Booking closed for this date (deadline: 5:00 PM same day)</span>
                  </p>
                )}
              </div>
              {errors.transportDate && (
                <p className="mt-2 text-red-400 text-sm">{errors.transportDate}</p>
              )}
            </div>

            {/* Drop-off Section */}
            <div className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/50">
              <label className="flex items-center space-x-2 text-lg font-semibold mb-4">
                <Car className="w-5 h-5 text-blue-400" />
                <span>Do you want to avail the drop-off?</span>
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, wantDropOff: 'yes' })}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                    formData.wantDropOff === 'yes'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    wantDropOff: 'no',
                    shiftEndTime: '',
                    gender: '',
                    acknowledgement: false,
                    route: ''
                  })}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                    formData.wantDropOff === 'no'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                  }`}
                >
                  No
                </button>
              </div>

              {formData.wantDropOff === 'yes' && (
                <div className="mt-8 space-y-6 animate-slide-down-transport">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Mention your shift ending time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.shiftEndTime}
                        onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
                        className={selectClassName}
                      >
                        <option value="" className="bg-slate-900 text-gray-400">Select time</option>
                        {SHIFT_END_TIMES.map((time) => (
                          <option key={time} value={time} className="bg-slate-900 text-white">{time}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.shiftEndTime && (
                      <p className="mt-2 text-red-400 text-sm">{errors.shiftEndTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Gender <span className="text-red-400">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                          formData.gender === 'male'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                        }`}
                      >
                        <Users className="w-5 h-5 inline mr-2" />
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                          formData.gender === 'female'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                        }`}
                      >
                        <Users className="w-5 h-5 inline mr-2" />
                        Female
                      </button>
                    </div>
                    {errors.gender && (
                      <p className="mt-2 text-red-400 text-sm">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      <Route className="w-4 h-4 inline mr-2" />
                      Select your route <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.route}
                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                        className={selectClassName}
                      >
                        <option value="" className="bg-slate-900 text-gray-400">Select route</option>
                        {ROUTES.map((route) => (
                          <option key={route} value={route} className="bg-slate-900 text-white">{route}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.route && (
                      <p className="mt-2 text-red-400 text-sm">{errors.route}</p>
                    )}
                  </div>

                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-600">
                    <label className="flex items-start space-x-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          checked={formData.acknowledgement}
                          onChange={(e) => setFormData({ ...formData, acknowledgement: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-md border-2 transition-all ${
                          formData.acknowledgement 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-slate-500 group-hover:border-blue-400'
                        }`}>
                          {formData.acknowledgement && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-200 block mb-1">Acknowledgement</span>
                        <span className="text-sm text-gray-400">
                          I confirm that I will be ready at the scheduled pickup/drop time & I agree to abide by the company's transport guidelines.
                        </span>
                      </div>
                    </label>
                    {errors.acknowledgement && (
                      <p className="mt-2 text-red-400 text-sm">{errors.acknowledgement}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pickup Section */}
            <div className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/50">
              <label className="flex items-center space-x-2 text-lg font-semibold mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Does your shift start after 8 PM?</span>
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shiftStartsAfter8pm: 'yes' })}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                    formData.shiftStartsAfter8pm === 'yes'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    shiftStartsAfter8pm: 'no',
                    needCabPickup: '',
                    pickupTime: '',
                    pickupAddress: ''
                  })}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                    formData.shiftStartsAfter8pm === 'no'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                  }`}
                >
                  No
                </button>
              </div>

              {formData.shiftStartsAfter8pm === 'yes' && (
                <div className="mt-8 space-y-6 animate-slide-down-transport">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Do you need CAB pickup?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needCabPickup: 'yes' })}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                          formData.needCabPickup === 'yes'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          needCabPickup: 'no',
                          pickupTime: '',
                          pickupAddress: ''
                        })}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                          formData.needCabPickup === 'no'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-600'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {formData.needCabPickup === 'yes' && (
                    <div className="space-y-6 animate-slide-down-transport">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Mention your pickup time <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pickupTime}
                          onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                          placeholder="e.g., 8:30 PM"
                          className="w-full px-6 py-4 bg-slate-900 border border-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-500"
                        />
                        {errors.pickupTime && (
                          <p className="mt-2 text-red-400 text-sm">{errors.pickupTime}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Mention your pickup address <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={formData.pickupAddress}
                          onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                          placeholder="Enter your complete pickup address"
                          rows={3}
                          className="w-full px-6 py-4 bg-slate-900 border border-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-500 resize-none"
                        />
                        {errors.pickupAddress && (
                          <p className="mt-2 text-red-400 text-sm">{errors.pickupAddress}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isDateDisabled}
              className="w-full py-5 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/25 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Booking...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Car className="w-6 h-6" />
                  <span>Book Transport</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <img
              src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840"
              alt="Logile"
              className="h-8 filter brightness-0 invert mb-6 md:mb-0"
            />
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Logile. Employee Transport Booking System.
            </p>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 max-w-md mx-4 text-center border border-slate-700 animate-scale-in-transport">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h3>
            <p className="text-gray-400 text-lg">Your transport has been successfully booked.</p>
            <p className="text-sm text-gray-500 mt-4">A confirmation will be sent to your email.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transport;
