import { useState, useEffect } from 'react';
import { Utensils, Clock, IndianRupee, CheckCircle, Car, Settings, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { MEAL_PRICES, MealPreference, LunchType } from './types';
import Admin from './components/Admin';
import Transport from './components/Transport';

type DinnerType = 'roti_only' | 'roti_rice_combined' | 'none';

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

// Animated food illustration - All elements inside SVG for proper positioning
const FoodIllustration = () => {
  const [hoveredFood, setHoveredFood] = useState<string | null>(null);
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl animate-glow-pulse" />
      
      {/* Complete SVG Illustration with all elements */}
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.4))' }}>
        <defs>
          {/* Plate gradients - Warm terracotta ceramic */}
          <radialGradient id="plateOuter" cx="50%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#e8a87c" />
            <stop offset="40%" stopColor="#d4875a" />
            <stop offset="70%" stopColor="#c06a3d" />
            <stop offset="100%" stopColor="#9e5330" />
          </radialGradient>
          <radialGradient id="plateInner" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#f5c9a8" />
            <stop offset="50%" stopColor="#e8b08a" />
            <stop offset="100%" stopColor="#d99665" />
          </radialGradient>
          {/* Plate glow effect */}
          <filter id="plateGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Fork/Spoon gradient - Dark steel */}
          <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="40%" stopColor="#6b7280" />
            <stop offset="60%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          
          {/* Food gradients */}
          <linearGradient id="rotiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="proteinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="carbsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fafafa" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>
          <linearGradient id="veggieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
        
        {/* Plate Shadow - darker for more contrast */}
        <ellipse cx="100" cy="178" rx="72" ry="12" fill="rgba(0,0,0,0.5)" />
        <ellipse cx="100" cy="175" rx="60" ry="8" fill="rgba(0,0,0,0.25)" />
        
        {/* Plate - Outer rim with glow */}
        <ellipse cx="100" cy="100" rx="78" ry="78" fill="url(#plateOuter)" filter="url(#plateGlow)" />
        
        {/* Plate rim edge - darker terracotta */}
        <ellipse cx="100" cy="100" rx="75" ry="75" fill="none" stroke="#8b4528" strokeWidth="3" />
        
        {/* Plate - Inner surface */}
        <ellipse cx="100" cy="100" rx="65" ry="65" fill="url(#plateInner)" />
        
        {/* Plate inner shadow for depth */}
        <ellipse cx="100" cy="100" rx="65" ry="65" fill="none" stroke="rgba(120,60,30,0.2)" strokeWidth="6" />
        
        {/* Plate decoration ring - darker accent */}
        <ellipse cx="100" cy="100" rx="55" ry="55" fill="none" stroke="#a85d35" strokeWidth="2" opacity="0.7" />
        
        {/* Inner decorative ring */}
        <ellipse cx="100" cy="100" rx="48" ry="48" fill="none" stroke="#c98860" strokeWidth="1" opacity="0.5" />
        
        {/* Highlight on top edge */}
        <path d="M 30 85 Q 100 50 170 85" fill="none" stroke="rgba(255,200,150,0.4)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Fork - Left side with arc animation (ON TOP of plate) */}
        <g className="animate-fork-move" style={{ transformOrigin: '15px 132px' }}>
          <g transform="translate(5, 40)">
            <rect x="0" y="0" width="4" height="35" rx="2" fill="url(#steelGrad)" />
            <rect x="8" y="0" width="4" height="35" rx="2" fill="url(#steelGrad)" />
            <rect x="16" y="0" width="4" height="35" rx="2" fill="url(#steelGrad)" />
            <rect x="6" y="32" width="10" height="60" rx="4" fill="url(#steelGrad)" />
          </g>
        </g>
        
        {/* Spoon - Right side with arc animation (ON TOP of plate) */}
        <g className="animate-spoon-move" style={{ transformOrigin: '185px 132px' }}>
          <g transform="translate(175, 40)">
            <ellipse cx="10" cy="12" rx="12" ry="15" fill="url(#steelGrad)" />
            <ellipse cx="10" cy="10" rx="8" ry="10" fill="#4b5563" />
            <rect x="4" y="24" width="12" height="68" rx="4" fill="url(#steelGrad)" />
          </g>
        </g>
        
        {/* === FOOD ITEMS ON PLATE === */}
        
        {/* Roti/Chapati - Top center */}
        <g 
          className="cursor-pointer transition-transform duration-300 hover:scale-110"
          onMouseEnter={() => setHoveredFood('roti')}
          onMouseLeave={() => setHoveredFood(null)}
          style={{ transform: hoveredFood === 'roti' ? 'translate(-5px, -10px) scale(1.15)' : '' }}
        >
          <ellipse cx="100" cy="75" rx="22" ry="10" fill="url(#rotiGrad)" />
          <ellipse cx="95" cy="73" rx="3" ry="2" fill="#92400e" opacity="0.4" />
          <ellipse cx="105" cy="77" rx="2" ry="1.5" fill="#92400e" opacity="0.3" />
        </g>
        
        {/* Protein (Chicken) - Right side */}
        <g 
          className="cursor-pointer transition-transform duration-300"
          onMouseEnter={() => setHoveredFood('protein')}
          onMouseLeave={() => setHoveredFood(null)}
          style={{ transform: hoveredFood === 'protein' ? 'translate(10px, -8px) scale(1.15)' : '' }}
        >
          <rect x="115" y="88" width="28" height="28" rx="6" fill="url(#proteinGrad)" transform="rotate(8 129 102)" />
          <ellipse cx="123" cy="96" rx="4" ry="3" fill="#fcd34d" opacity="0.7" />
          <ellipse cx="132" cy="108" rx="3" ry="2" fill="#fef3c7" opacity="0.6" />
        </g>
        
        {/* Carbs (Rice) - Left side */}
        <g 
          className="cursor-pointer transition-transform duration-300"
          onMouseEnter={() => setHoveredFood('carbs')}
          onMouseLeave={() => setHoveredFood(null)}
          style={{ transform: hoveredFood === 'carbs' ? 'translate(-10px, -8px) scale(1.15)' : '' }}
        >
          <path d="M55 120 L70 95 L85 120 Z" fill="url(#carbsGrad)" />
          <ellipse cx="65" cy="105" rx="2" ry="3" fill="white" />
          <ellipse cx="75" cy="108" rx="2" ry="3" fill="white" />
          <ellipse cx="70" cy="115" rx="2" ry="2" fill="#f5f5f5" />
        </g>
        
        {/* Veggies - Center */}
        <g 
          className="cursor-pointer transition-transform duration-300"
          onMouseEnter={() => setHoveredFood('veggies')}
          onMouseLeave={() => setHoveredFood(null)}
          style={{ transform: hoveredFood === 'veggies' ? 'translate(0, -10px) scale(1.2)' : '' }}
        >
          <circle cx="95" cy="105" r="8" fill="url(#veggieGrad)" />
          <circle cx="95" cy="103" r="3" fill="#86efac" opacity="0.5" />
        </g>
        
        {/* Small veggie */}
        <circle cx="110" cy="118" r="5" fill="#10b981" className="cursor-pointer hover:scale-125 transition-transform duration-300" />
        
        {/* Chili */}
        <ellipse cx="88" cy="115" rx="6" ry="2" fill="#dc2626" transform="rotate(-30 88 115)" className="cursor-pointer hover:scale-150 transition-transform duration-300" />
        
        {/* Steam */}
        <g className="animate-steam-rise" opacity="0.4">
          <path d="M90 55 Q88 45 90 35" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M100 50 Q102 40 100 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M110 55 Q112 45 110 35" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      
      {/* Tooltips - positioned outside SVG */}
      {hoveredFood === 'roti' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-fade-in">
          🫓 I'm Roti! Fresh & warm
        </div>
      )}
      {hoveredFood === 'protein' && (
        <div className="absolute top-12 right-0 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-fade-in">
          💪 I'm Protein! Build muscles!
        </div>
      )}
      {hoveredFood === 'carbs' && (
        <div className="absolute top-12 left-0 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-fade-in">
          🍚 I'm Carbs! Energy boost!
        </div>
      )}
      {hoveredFood === 'veggies' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-fade-in">
          🥦 Veggies here! Eat healthy!
        </div>
      )}
      
      {/* Hover instruction */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        Hover on food items!
      </div>
    </div>
  );
};

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTransport, setShowTransport] = useState(false);

  const checkOrderingAllowed = (mealType: 'lunch' | 'dinner', orderDate: string) => {
    const now = new Date();
    const selectedDate = new Date(orderDate + 'T00:00:00');
    
    if (mealType === 'lunch') {
      const deadline = new Date(selectedDate);
      deadline.setDate(deadline.getDate() - 1);
      deadline.setHours(21, 0, 0, 0);
      return now <= deadline;
    } else {
      const deadline = new Date(selectedDate);
      deadline.setHours(16, 30, 0, 0);
      return now <= deadline;
    }
  };

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    mealType: [] as string[],
    lunchPreference: 'none' as MealPreference,
    lunchType: 'none' as LunchType,
    dinnerPreference: 'none' as MealPreference,
    dinnerType: 'none' as DinnerType,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Capybara states
  const [leftCapyAngry, setLeftCapyAngry] = useState(false);
  const [rightCapyAngry, setRightCapyAngry] = useState(false);
  const [foodHolder, setFoodHolder] = useState<'left' | 'flying-right' | 'right' | 'flying-left'>('left');
  const [animationPhase, setAnimationPhase] = useState<'holding' | 'throwing' | 'catching' | 'eating'>('holding');

  const handleLeftCapyClick = () => {
    setLeftCapyAngry(true);
    setTimeout(() => setLeftCapyAngry(false), 2000);
  };

  const handleRightCapyClick = () => {
    setRightCapyAngry(true);
    setTimeout(() => setRightCapyAngry(false), 2000);
  };

  // Food throwing animation cycle
  useEffect(() => {
    // Don't animate if either capybara is angry
    if (leftCapyAngry || rightCapyAngry) return;

    const animationCycle = async () => {
      // Left capybara holds and eats (facing forward)
      setFoodHolder('left');
      setAnimationPhase('eating');
      await new Promise(r => setTimeout(r, 1800));
      
      // Left turns body and throws - food releases at arm release point (200ms into throw)
      setAnimationPhase('throwing');
      await new Promise(r => setTimeout(r, 200)); // Short wind-up, then release
      setFoodHolder('flying-right'); // Food releases when arm is at release point
      await new Promise(r => setTimeout(r, 1000)); // Food flight time
      
      // Right catches
      setFoodHolder('right');
      setAnimationPhase('catching');
      await new Promise(r => setTimeout(r, 350));
      
      // Right eats (facing forward)
      setAnimationPhase('eating');
      await new Promise(r => setTimeout(r, 1800));
      
      // Right turns body and throws - food releases at arm release point
      setAnimationPhase('throwing');
      await new Promise(r => setTimeout(r, 200)); // Short wind-up, then release
      setFoodHolder('flying-left'); // Food releases when arm is at release point
      await new Promise(r => setTimeout(r, 1000)); // Food flight time
      
      // Left catches
      setFoodHolder('left');
      setAnimationPhase('catching');
      await new Promise(r => setTimeout(r, 350));
    };

    animationCycle();
    const interval = setInterval(animationCycle, 6700); // Total cycle time
    return () => clearInterval(interval);
  }, [leftCapyAngry, rightCapyAngry]);

  const isLunchAvailable = checkOrderingAllowed('lunch', formData.orderDate);
  const isDinnerAvailable = checkOrderingAllowed('dinner', formData.orderDate);

  const handleMealTypeChange = (meal: string) => {
    setFormData((prev) => {
      const mealType = prev.mealType.includes(meal)
        ? prev.mealType.filter((m) => m !== meal)
        : [...prev.mealType, meal];
      return { ...prev, mealType };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    if (formData.mealType.includes('lunch') && formData.lunchPreference !== 'none') {
      total += MEAL_PRICES[formData.lunchPreference];
    }
    if (formData.mealType.includes('dinner') && formData.dinnerPreference !== 'none') {
      total += MEAL_PRICES[formData.dinnerPreference];
    }
    return total;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    if (!formData.userEmail.trim() || !formData.userEmail.includes('@')) {
      newErrors.userEmail = 'Valid email is required';
    }
    if (formData.mealType.length === 0) {
      newErrors.mealType = 'Please select at least one meal';
    }
    if (formData.mealType.includes('lunch') && formData.lunchPreference === 'none') {
      newErrors.lunchPreference = 'Please select lunch preference';
    }
    if (formData.mealType.includes('lunch') && formData.lunchPreference !== 'none' && formData.lunchType === 'none') {
      newErrors.lunchType = 'Please select lunch type';
    }
    if (formData.mealType.includes('dinner') && formData.dinnerPreference === 'none') {
      newErrors.dinnerPreference = 'Please select dinner preference';
    }
    if (formData.mealType.includes('dinner') && formData.dinnerPreference !== 'none' && formData.dinnerType === 'none') {
      newErrors.dinnerType = 'Please select dinner type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendConfirmationEmail = async (orderData: any) => {
    try {
      const emailHTML = `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Food Order Confirmation</h2>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${orderData.user_name}</p>
              <p><strong>Email:</strong> ${orderData.user_email}</p>
              <p><strong>Order Date:</strong> ${orderData.order_date}</p>
            </div>
            
            ${orderData.lunch_preference !== 'none' ? `
              <div style="margin: 20px 0;">
                <h3 style="color: #059669;">Lunch Order</h3>
                <p><strong>Preference:</strong> ${orderData.lunch_preference.charAt(0).toUpperCase() + orderData.lunch_preference.slice(1)}</p>
                <p><strong>Type:</strong> ${orderData.lunch_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                <p><strong>Price:</strong> ₹${orderData.lunch_price}</p>
              </div>
            ` : ''}
            
            ${orderData.dinner_preference !== 'none' ? `
              <div style="margin: 20px 0;">
                <h3 style="color: #dc2626;">Dinner Order</h3>
                <p><strong>Preference:</strong> ${orderData.dinner_preference.charAt(0).toUpperCase() + orderData.dinner_preference.slice(1)}</p>
                <p><strong>Type:</strong> ${orderData.dinner_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                <p><strong>Price:</strong> ₹${orderData.dinner_price}</p>
              </div>
            ` : ''}
            
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong style="font-size: 18px;">Total Amount: ₹${orderData.total_price}</strong></p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #1e40af;"><em>Payment to be made at the end of the month.</em></p>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">This is an automated confirmation email from Logile Food Ordering System.</p>
          </body>
        </html>
      `;

      console.log('Email to be sent to:', orderData.user_email);
      console.log('Email CC to HR:', import.meta.env.VITE_HR_EMAIL || 'hr@logile.com');
      console.log('Email content:', emailHTML);
      console.log('Email would be sent successfully');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const lunchPrice = formData.mealType.includes('lunch') && formData.lunchPreference !== 'none'
        ? MEAL_PRICES[formData.lunchPreference]
        : 0;
      const dinnerPrice = formData.mealType.includes('dinner') && formData.dinnerPreference !== 'none'
        ? MEAL_PRICES[formData.dinnerPreference]
        : 0;

      const orderData = {
        user_name: formData.userName,
        user_email: formData.userEmail,
        order_date: formData.orderDate,
        meal_type: formData.mealType.join(', '),
        lunch_preference: formData.lunchPreference,
        lunch_type: formData.lunchType,
        dinner_preference: formData.dinnerPreference,
        dinner_type: formData.dinnerType,
        lunch_price: lunchPrice,
        dinner_price: dinnerPrice,
        total_price: lunchPrice + dinnerPrice,
      };

      const { error } = await supabase.from('food_orders').insert(orderData);

      if (error) throw error;

      await sendConfirmationEmail(orderData);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          userName: '',
          userEmail: '',
          orderDate: new Date().toISOString().split('T')[0],
          mealType: [],
          lunchPreference: 'none',
          lunchType: 'none',
          dinnerPreference: 'none',
          dinnerType: 'none',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAdmin) {
    return <Admin onBack={() => setShowAdmin(false)} />;
  }

  if (showTransport) {
    return <Transport onBack={() => setShowTransport(false)} />;
  }

  // Show configuration error if Supabase is not set up
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Configuration Required</h1>
          <p className="text-lg text-gray-300 mb-8">
            The application is missing Supabase environment variables.
          </p>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-left mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Setup Instructions:</h2>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="text-orange-400 font-bold mr-3">1.</span>
                <span>Go to your repository settings on GitHub</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 font-bold mr-3">2.</span>
                <span>Navigate to <strong className="text-white">Settings → Secrets and variables → Actions</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 font-bold mr-3">3.</span>
                <span>Add these repository secrets:</span>
              </li>
            </ol>
            <div className="mt-4 space-y-2 ml-8">
              <div className="bg-slate-800 border border-slate-600 rounded px-4 py-2 font-mono text-sm">
                <span className="text-blue-400">VITE_SUPABASE_URL</span>
              </div>
              <div className="bg-slate-800 border border-slate-600 rounded px-4 py-2 font-mono text-sm">
                <span className="text-blue-400">VITE_SUPABASE_ANON_KEY</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              After adding the secrets, the GitHub Actions workflow will automatically redeploy the site.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Animated Background - Rich dark with warm undertones */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-amber-950/40 to-slate-950 animate-gradient-shift" />
        
        {/* Secondary gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-float-slow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Animated mesh pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 animate-mesh-move" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 146, 60, 0.8) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        {/* Floating food emoji particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🍕', '🍔', '🌮', '🍜', '🍛', '🥗', '🍱', '🥘'].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-20 animate-float-emoji"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${8 + i * 2}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
        
        {/* Warm glow particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-glow-particle"
              style={{
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 5) * 18}%`,
                background: `radial-gradient(circle, rgba(251, 146, 60, ${0.3 + (i % 3) * 0.1}) 0%, transparent 70%)`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Subtle light rays */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-orange-400 via-transparent to-transparent transform -skew-x-12 animate-ray-1" />
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-amber-400 via-transparent to-transparent transform skew-x-6 animate-ray-2" />
          <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-orange-300 via-transparent to-transparent transform skew-x-12 animate-ray-3" />
        </div>

        {/* Navigation */}
        <nav className="relative z-30 flex items-center justify-between px-8 py-6">
          <img
            src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840"
            alt="Logile"
            className="h-8 filter brightness-0 invert"
          />
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTransport(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-500/80 transition-all font-medium border border-blue-500/50"
            >
              <Car className="w-4 h-4" />
              <span>Transport</span>
            </button>
            <button
              onClick={() => setShowAdmin(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all font-medium border border-slate-600"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </nav>

        {/* LEFT CAPYBARA - With whole body turning when throwing */}
        <div className="absolute left-8 bottom-16 z-20 hidden lg:block">
          <div 
            className={`relative cursor-pointer select-none hover:scale-105 transition-transform duration-300 ${
              leftCapyAngry ? '' :
              (foodHolder === 'left' && animationPhase === 'throwing') || foodHolder === 'flying-right'
                ? 'capy-turn-right'
                : ''
            }`}
            onClick={handleLeftCapyClick}
          >
            <svg 
              width="150" 
              height="140" 
              viewBox="0 0 150 140" 
              className={`drop-shadow-xl ${leftCapyAngry ? 'animate-capy-shake' : ''}`}
            >
              <defs>
                <linearGradient id="capyBodyL" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9B8262" />
                  <stop offset="50%" stopColor="#7D6B52" />
                  <stop offset="100%" stopColor="#5D4E3A" />
                </linearGradient>
                <linearGradient id="capyFaceL" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B5A48A" />
                  <stop offset="100%" stopColor="#9B8A70" />
                </linearGradient>
                <linearGradient id="capyMuzzleL" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C4B59E" />
                  <stop offset="100%" stopColor="#A89880" />
                </linearGradient>
                <radialGradient id="capyNoseL" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#4A3C32" />
                  <stop offset="100%" stopColor="#2D231C" />
                </radialGradient>
                <radialGradient id="blushL" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFAA99" />
                  <stop offset="100%" stopColor="#FFAA99" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="angryBlushL" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Ground shadow */}
              <ellipse cx="75" cy="134" rx="50" ry="6" fill="rgba(0,0,0,0.2)" />
              
              {/* Back haunches */}
              <ellipse cx="45" cy="115" rx="22" ry="15" fill="#5D4E3A" />
              <ellipse cx="105" cy="115" rx="22" ry="15" fill="#5D4E3A" />
              
              {/* Main body */}
              <ellipse cx="75" cy="98" rx="48" ry="35" fill="url(#capyBodyL)" />
              <ellipse cx="67" cy="90" rx="30" ry="22" fill="#A89070" opacity="0.3" />
              
              {/* HEAD - Turns right when throwing, faces front when eating */}
              <g 
                className={`transition-transform duration-300 origin-center ${
                  leftCapyAngry ? '' :
                  (foodHolder === 'left' && animationPhase === 'throwing') || foodHolder === 'flying-right' 
                    ? 'animate-head-turn-right' 
                    : foodHolder === 'left' && animationPhase === 'eating' 
                      ? 'animate-capy-eat-head' 
                      : ''
                }`}
                style={{ transformOrigin: '75px 55px' }}
              >
                {/* Back of head */}
                <ellipse cx="75" cy="50" rx="28" ry="24" fill="url(#capyBodyL)" />
                
                {/* Face */}
                <rect x="49" y="36" width="52" height="40" rx="16" fill="url(#capyFaceL)" />
                <rect x="53" y="48" width="44" height="28" rx="12" fill="url(#capyMuzzleL)" />
                
                {/* Nose */}
                <ellipse cx="75" cy="56" rx="12" ry="9" fill="url(#capyNoseL)" />
                <ellipse cx="70" cy="56" rx="3.5" ry="2.5" fill="#1D1815" />
                <ellipse cx="80" cy="56" rx="3.5" ry="2.5" fill="#1D1815" />
                
                {/* Angry eyebrows */}
                {leftCapyAngry && (
                  <>
                    <path d="M 52 30 L 68 35" stroke="#3D2E22" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 98 30 L 82 35" stroke="#3D2E22" strokeWidth="3" strokeLinecap="round" />
                  </>
                )}
                
                {/* Eyes */}
                <circle cx="60" cy="40" r="4.5" fill="#1D1815" />
                <circle cx="61" cy="38" r="1.8" fill="white" />
                <circle cx="90" cy="40" r="4.5" fill="#1D1815" />
                <circle cx="91" cy="38" r="1.8" fill="white" />
                
                {/* Ears */}
                <ellipse cx="54" cy="26" rx="6" ry="7" fill="#7D6B52" />
                <ellipse cx="54" cy="26" rx="3.5" ry="4.5" fill="#5D4E3A" />
                <ellipse cx="96" cy="26" rx="6" ry="7" fill="#7D6B52" />
                <ellipse cx="96" cy="26" rx="3.5" ry="4.5" fill="#5D4E3A" />
                
                {/* Blush */}
                <ellipse cx="60" cy="48" rx="5" ry="3" fill={leftCapyAngry ? "url(#angryBlushL)" : "url(#blushL)"} opacity={leftCapyAngry ? "0.7" : "0.5"} />
                <ellipse cx="90" cy="48" rx="5" ry="3" fill={leftCapyAngry ? "url(#angryBlushL)" : "url(#blushL)"} opacity={leftCapyAngry ? "0.7" : "0.5"} />
                
                {/* Mouth */}
                {leftCapyAngry ? (
                  <path d="M 67 70 Q 75 64 83 70" stroke="#3D2E22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                ) : foodHolder === 'left' && animationPhase === 'eating' ? (
                  <ellipse cx="75" cy="68" rx="5" ry="4" fill="#3D2E22" className="animate-mouth-chew" />
                ) : (
                  <path d="M 67 68 Q 75 74 83 68" stroke="#3D2E22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                )}
              </g>
              
              {/* LEFT ARM - Inner arm, holds food when eating */}
              <g className={`transition-all duration-500 ${
                foodHolder === 'left' && animationPhase === 'eating' ? 'animate-arm-hold-food' : ''
              }`}>
                <ellipse cx="50" cy="88" rx="11" ry="20" fill="#7D6B52" />
                <ellipse cx="45" cy="72" rx="9" ry="6" fill="#5D4E3A" />
              </g>
              
              {/* RIGHT ARM - Outer arm, does the throwing */}
              <g className={`transition-all duration-300 origin-bottom ${
                (foodHolder === 'left' && animationPhase === 'throwing') || foodHolder === 'flying-right'
                  ? 'animate-arm-throw-motion' 
                  : foodHolder === 'left' && animationPhase === 'eating' 
                    ? 'animate-arm-hold-food' 
                    : (foodHolder === 'flying-left' || (foodHolder === 'left' && animationPhase === 'catching'))
                      ? 'animate-arm-catch-ready'
                      : ''
              }`} style={{ transformOrigin: '100px 100px' }}>
                <ellipse cx="100" cy="88" rx="11" ry="20" fill="#7D6B52" />
                <ellipse cx="105" cy="72" rx="9" ry="6" fill="#5D4E3A" />
              </g>
              
              {/* Food when held by left capybara - positioned at hands when eating */}
              {foodHolder === 'left' && animationPhase === 'eating' && (
                <g className="animate-food-being-eaten">
                  <circle cx="75" cy="72" r="11" fill="#FF9F43" />
                  <circle cx="71" cy="68" r="4" fill="#FFBE76" opacity="0.6" />
                  <ellipse cx="75" cy="62" rx="2.5" ry="4" fill="#27AE60" />
                </g>
              )}
              
              {/* Food in throwing hand position */}
              {foodHolder === 'left' && animationPhase === 'catching' && (
                <g>
                  <circle cx="105" cy="68" r="11" fill="#FF9F43" />
                  <circle cx="101" cy="64" r="4" fill="#FFBE76" opacity="0.6" />
                  <ellipse cx="105" cy="58" rx="2.5" ry="4" fill="#27AE60" />
                </g>
              )}
              
              {/* Hearts when eating */}
              {!leftCapyAngry && foodHolder === 'left' && animationPhase === 'eating' && (
                <>
                  <g className="animate-hearts-float">
                    <text x="115" y="30" fontSize="14" fill="#FF6B6B" opacity="0.8">♥</text>
                  </g>
                  <g className="animate-hearts-float-2">
                    <text x="125" y="50" fontSize="10" fill="#FF6B6B" opacity="0.6">♥</text>
                  </g>
                </>
              )}
              
              {/* Anger symbol */}
              {leftCapyAngry && (
                <g className="animate-pulse">
                  <text x="115" y="30" fontSize="16" fill="#FF4444" opacity="0.9">💢</text>
                </g>
              )}
            </svg>
            
            {/* Text */}
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              leftCapyAngry 
                ? 'text-red-400 font-bold animate-bounce scale-110' 
                : foodHolder === 'left' && animationPhase === 'eating' 
                  ? 'text-amber-400/90 animate-nom-text' 
                  : 'text-amber-400/0'
            }`}>
              {leftCapyAngry ? "Don't touch! 😠" : foodHolder === 'left' && animationPhase === 'eating' ? "nom nom ♪" : ""}
            </div>
          </div>
        </div>

        {/* FLYING FOOD - Physics-based parabolic trajectory (absolute within hero section) */}
        {(foodHolder === 'flying-right' || foodHolder === 'flying-left') && (
          <div 
            className={`absolute z-50 pointer-events-none hidden lg:block ${
              foodHolder === 'flying-right' ? 'food-trajectory-right' : 'food-trajectory-left'
            }`}
            style={{
              left: foodHolder === 'flying-right' ? '160px' : 'auto',
              right: foodHolder === 'flying-left' ? '160px' : 'auto',
              bottom: '140px',
            }}
          >
            {/* Orange/fruit with rotation */}
            <div className="w-11 h-11 relative food-spin">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-full shadow-xl border-2 border-orange-300/50"></div>
              <div className="absolute top-1.5 left-2 w-3 h-3 bg-orange-200/80 rounded-full"></div>
              {/* Leaf */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <div className="w-2.5 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full transform -rotate-12"></div>
              </div>
              {/* Shadow underneath */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm food-shadow"></div>
            </div>
          </div>
        )}

        {/* RIGHT CAPYBARA - Mirrored with whole body turning when throwing */}
        <div className="absolute right-8 bottom-16 z-20 hidden lg:block">
          <div 
            className={`relative cursor-pointer select-none hover:scale-105 transition-transform duration-300 ${
              rightCapyAngry ? '' :
              (foodHolder === 'right' && animationPhase === 'throwing') || foodHolder === 'flying-left'
                ? 'capy-turn-left'
                : ''
            }`}
            onClick={handleRightCapyClick}
          >
            <svg 
              width="150" 
              height="140" 
              viewBox="0 0 150 140" 
              className={`drop-shadow-xl ${rightCapyAngry ? 'animate-capy-shake' : ''}`}
              style={{ transform: 'scaleX(-1)' }}
            >
              <defs>
                <linearGradient id="capyBodyR" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9B8262" />
                  <stop offset="50%" stopColor="#7D6B52" />
                  <stop offset="100%" stopColor="#5D4E3A" />
                </linearGradient>
                <linearGradient id="capyFaceR" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B5A48A" />
                  <stop offset="100%" stopColor="#9B8A70" />
                </linearGradient>
                <linearGradient id="capyMuzzleR" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C4B59E" />
                  <stop offset="100%" stopColor="#A89880" />
                </linearGradient>
                <radialGradient id="capyNoseR" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#4A3C32" />
                  <stop offset="100%" stopColor="#2D231C" />
                </radialGradient>
                <radialGradient id="blushR" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFAA99" />
                  <stop offset="100%" stopColor="#FFAA99" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="angryBlushR" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Ground shadow */}
              <ellipse cx="75" cy="134" rx="50" ry="6" fill="rgba(0,0,0,0.2)" />
              
              {/* Back haunches */}
              <ellipse cx="45" cy="115" rx="22" ry="15" fill="#5D4E3A" />
              <ellipse cx="105" cy="115" rx="22" ry="15" fill="#5D4E3A" />
              
              {/* Main body */}
              <ellipse cx="75" cy="98" rx="48" ry="35" fill="url(#capyBodyR)" />
              <ellipse cx="67" cy="90" rx="30" ry="22" fill="#A89070" opacity="0.3" />
              
              {/* HEAD - Turns when throwing (towards left capybara), faces front when eating */}
              <g 
                className={`transition-transform duration-300 origin-center ${
                  rightCapyAngry ? '' :
                  (foodHolder === 'right' && animationPhase === 'throwing') || foodHolder === 'flying-left'
                    ? 'animate-head-turn-right' 
                    : foodHolder === 'right' && animationPhase === 'eating' 
                      ? 'animate-capy-eat-head' 
                      : ''
                }`}
                style={{ transformOrigin: '75px 55px' }}
              >
                {/* Back of head */}
                <ellipse cx="75" cy="50" rx="28" ry="24" fill="url(#capyBodyR)" />
                
                {/* Face */}
                <rect x="49" y="36" width="52" height="40" rx="16" fill="url(#capyFaceR)" />
                <rect x="53" y="48" width="44" height="28" rx="12" fill="url(#capyMuzzleR)" />
                
                {/* Nose */}
                <ellipse cx="75" cy="56" rx="12" ry="9" fill="url(#capyNoseR)" />
                <ellipse cx="70" cy="56" rx="3.5" ry="2.5" fill="#1D1815" />
                <ellipse cx="80" cy="56" rx="3.5" ry="2.5" fill="#1D1815" />
                
                {/* Angry eyebrows */}
                {rightCapyAngry && (
                  <>
                    <path d="M 52 30 L 68 35" stroke="#3D2E22" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 98 30 L 82 35" stroke="#3D2E22" strokeWidth="3" strokeLinecap="round" />
                  </>
                )}
                
                {/* Eyes */}
                <circle cx="60" cy="40" r="4.5" fill="#1D1815" />
                <circle cx="61" cy="38" r="1.8" fill="white" />
                <circle cx="90" cy="40" r="4.5" fill="#1D1815" />
                <circle cx="91" cy="38" r="1.8" fill="white" />
                
                {/* Ears */}
                <ellipse cx="54" cy="26" rx="6" ry="7" fill="#7D6B52" />
                <ellipse cx="54" cy="26" rx="3.5" ry="4.5" fill="#5D4E3A" />
                <ellipse cx="96" cy="26" rx="6" ry="7" fill="#7D6B52" />
                <ellipse cx="96" cy="26" rx="3.5" ry="4.5" fill="#5D4E3A" />
                
                {/* Blush */}
                <ellipse cx="60" cy="48" rx="5" ry="3" fill={rightCapyAngry ? "url(#angryBlushR)" : "url(#blushR)"} opacity={rightCapyAngry ? "0.7" : "0.5"} />
                <ellipse cx="90" cy="48" rx="5" ry="3" fill={rightCapyAngry ? "url(#angryBlushR)" : "url(#blushR)"} opacity={rightCapyAngry ? "0.7" : "0.5"} />
                
                {/* Mouth */}
                {rightCapyAngry ? (
                  <path d="M 67 70 Q 75 64 83 70" stroke="#3D2E22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                ) : foodHolder === 'right' && animationPhase === 'eating' ? (
                  <ellipse cx="75" cy="68" rx="5" ry="4" fill="#3D2E22" className="animate-mouth-chew" />
                ) : (
                  <path d="M 67 68 Q 75 74 83 68" stroke="#3D2E22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                )}
              </g>
              
              {/* LEFT ARM - Inner arm */}
              <g className={`transition-all duration-500 ${
                foodHolder === 'right' && animationPhase === 'eating' ? 'animate-arm-hold-food' : ''
              }`}>
                <ellipse cx="50" cy="88" rx="11" ry="20" fill="#7D6B52" />
                <ellipse cx="45" cy="72" rx="9" ry="6" fill="#5D4E3A" />
              </g>
              
              {/* RIGHT ARM - Outer arm, does the throwing */}
              <g className={`transition-all duration-300 origin-bottom ${
                (foodHolder === 'right' && animationPhase === 'throwing') || foodHolder === 'flying-left'
                  ? 'animate-arm-throw-motion' 
                  : foodHolder === 'right' && animationPhase === 'eating' 
                    ? 'animate-arm-hold-food' 
                    : (foodHolder === 'flying-right' || (foodHolder === 'right' && animationPhase === 'catching'))
                      ? 'animate-arm-catch-ready'
                      : ''
              }`} style={{ transformOrigin: '100px 100px' }}>
                <ellipse cx="100" cy="88" rx="11" ry="20" fill="#7D6B52" />
                <ellipse cx="105" cy="72" rx="9" ry="6" fill="#5D4E3A" />
              </g>
              
              {/* Food when held by right capybara */}
              {foodHolder === 'right' && animationPhase === 'eating' && (
                <g className="animate-food-being-eaten">
                  <circle cx="75" cy="72" r="11" fill="#FF9F43" />
                  <circle cx="71" cy="68" r="4" fill="#FFBE76" opacity="0.6" />
                  <ellipse cx="75" cy="62" rx="2.5" ry="4" fill="#27AE60" />
                </g>
              )}
              
              {/* Food in catching position */}
              {foodHolder === 'right' && animationPhase === 'catching' && (
                <g>
                  <circle cx="105" cy="68" r="11" fill="#FF9F43" />
                  <circle cx="101" cy="64" r="4" fill="#FFBE76" opacity="0.6" />
                  <ellipse cx="105" cy="58" rx="2.5" ry="4" fill="#27AE60" />
                </g>
              )}
              
              {/* Hearts when eating */}
              {!rightCapyAngry && foodHolder === 'right' && animationPhase === 'eating' && (
                <>
                  <g className="animate-hearts-float">
                    <text x="115" y="30" fontSize="14" fill="#FF6B6B" opacity="0.8">♥</text>
                  </g>
                  <g className="animate-hearts-float-2">
                    <text x="125" y="50" fontSize="10" fill="#FF6B6B" opacity="0.6">♥</text>
                  </g>
                </>
              )}
              
              {/* Anger symbol */}
              {rightCapyAngry && (
                <g className="animate-pulse">
                  <text x="115" y="30" fontSize="16" fill="#FF4444" opacity="0.9">💢</text>
                </g>
              )}
            </svg>
            
            {/* Text */}
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              rightCapyAngry 
                ? 'text-red-400 font-bold animate-bounce scale-110' 
                : foodHolder === 'right' && animationPhase === 'eating' 
                  ? 'text-amber-400/90 animate-nom-text' 
                  : 'text-amber-400/0'
            }`}>
              {rightCapyAngry ? "Don't touch! 😠" : foodHolder === 'right' && animationPhase === 'eating' ? "nom nom ♪" : ""}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 -mt-20">
          <FoodIllustration />
          
          <div className="animate-hero-fade-in mt-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-orange-400">
              Food
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-gray-300 mb-8">
              Employee Meal Ordering System
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
              Order your daily meals with ease and convenience
            </p>
            
            <button 
              onClick={() => smoothScrollTo('order')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
            >
              <span>Order Now</span>
              <Utensils className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-scroll-indicator" />
          </div>
        </div>
      </div>

      {/* Order Form Section */}
      <div id="order" className="relative py-20 bg-gradient-to-b from-slate-900 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Place Your Order</h2>
            <p className="text-lg text-gray-400">Fill in the details below to order your meal</p>
          </div>

          {/* Info Cards - Enhanced hover animations */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group relative p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-slate-800/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/5 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:rotate-3">
                  <IndianRupee className="w-8 h-8 text-blue-400 transition-all duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-blue-300">Food Charges</h3>
                <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">Borne by employees on actuals</p>
              </div>
            </div>
            
            <div className="group relative p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-slate-800/50 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/10 group-hover:to-green-600/5 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-green-500/20 group-hover:rotate-3">
                  <Utensils className="w-8 h-8 text-green-400 transition-all duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-green-300">Admin Costs</h3>
                <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">Covered by company</p>
              </div>
            </div>
            
            <div className="group relative p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-slate-800/50 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/0 group-hover:from-amber-500/10 group-hover:to-amber-600/5 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:rotate-3">
                  <Clock className="w-8 h-8 text-amber-400 transition-all duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-amber-300">Dinner Timing</h3>
                <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">8:30 PM - 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 mb-12">
            <div className="p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Note:</strong> Payment to be made at the end of the month.
              </p>
            </div>
            <div className="p-4 bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Order Deadlines:</strong> Lunch by 9 PM previous day. Dinner by 4:30 PM same day.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-500 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-gray-500"
                  placeholder="Enter your full name"
                />
                {errors.userName && <p className="mt-2 text-sm text-red-400">{errors.userName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-500 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-gray-500"
                  placeholder="your.email@logile.com"
                />
                {errors.userEmail && <p className="mt-2 text-sm text-red-400">{errors.userEmail}</p>}
              </div>
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Order Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className="w-full px-6 py-4 bg-slate-900 border border-slate-500 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white"
              />
            </div>

            {/* Meal Type Selection */}
            <div className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/50">
              <label className="block text-lg font-semibold text-white mb-6">
                I want to opt for <span className="text-red-400">*</span>
              </label>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                  isLunchAvailable 
                    ? 'border-slate-600 cursor-pointer hover:bg-slate-700/30 hover:border-orange-500' 
                    : 'border-slate-700 opacity-50 cursor-not-allowed bg-slate-800/30'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.mealType.includes('lunch')}
                      onChange={() => handleMealTypeChange('lunch')}
                      disabled={!isLunchAvailable}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 disabled:opacity-50 bg-slate-700 border-slate-600"
                    />
                    <span className="ml-4 text-white font-medium text-lg">Lunch</span>
                  </div>
                  {!isLunchAvailable && (
                    <span className="text-xs text-red-400 font-medium">Order by 9 PM previous day</span>
                  )}
                </label>

                <label className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                  isDinnerAvailable 
                    ? 'border-slate-600 cursor-pointer hover:bg-slate-700/30 hover:border-orange-500' 
                    : 'border-slate-700 opacity-50 cursor-not-allowed bg-slate-800/30'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.mealType.includes('dinner')}
                      onChange={() => handleMealTypeChange('dinner')}
                      disabled={!isDinnerAvailable}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 disabled:opacity-50 bg-slate-700 border-slate-600"
                    />
                    <span className="ml-4 text-white font-medium text-lg">Dinner</span>
                  </div>
                  {!isDinnerAvailable && (
                    <span className="text-xs text-red-400 font-medium">Order by 4:30 PM same day</span>
                  )}
                </label>

                <label className="flex items-center p-5 rounded-xl border-2 border-slate-700 opacity-50 cursor-not-allowed">
                  <input type="checkbox" disabled className="w-5 h-5 bg-slate-700 border-slate-600" />
                  <span className="ml-4 text-gray-500 font-medium">Snacks <span className="text-xs">(Currently not available)</span></span>
                </label>
              </div>
              {errors.mealType && <p className="mt-4 text-sm text-red-400">{errors.mealType}</p>}
            </div>

            {/* Lunch Options */}
            {formData.mealType.includes('lunch') && (
              <div className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/50 animate-slide-down-transport">
                <label className="block text-lg font-semibold text-white mb-6">
                  Lunch Preference <span className="text-red-400">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(MEAL_PRICES).map(([key, price]) => (
                    <label
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.lunchPreference === key 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-slate-600 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="lunchPreference"
                          value={key}
                          checked={formData.lunchPreference === key}
                          onChange={(e) => setFormData({ ...formData, lunchPreference: e.target.value as MealPreference })}
                          className="w-5 h-5 text-orange-600 focus:ring-2 focus:ring-orange-500 bg-slate-700 border-slate-600"
                        />
                        <span className={`ml-3 font-medium capitalize ${key === 'none' ? 'text-gray-400 text-sm' : 'text-white'}`}>
                          {key === 'none' ? "I don't want to avail" : key}
                        </span>
                      </div>
                      {key !== 'none' && <span className="text-sm font-semibold text-orange-400">₹{price}</span>}
                    </label>
                  ))}
                </div>
                {errors.lunchPreference && <p className="mt-4 text-sm text-red-400">{errors.lunchPreference}</p>}

                {formData.lunchPreference !== 'none' && (
                  <div className="mt-8 animate-slide-down-transport">
                    <label className="block text-lg font-semibold text-white mb-4">
                      I want (for lunch) <span className="text-red-400">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.lunchType === 'roti_only' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="lunchType"
                          value="roti_only"
                          checked={formData.lunchType === 'roti_only'}
                          onChange={(e) => setFormData({ ...formData, lunchType: e.target.value as LunchType })}
                          className="w-5 h-5 text-orange-600 bg-slate-700 border-slate-600"
                        />
                        <span className="ml-3 text-white font-medium">Only Roti Meal</span>
                      </label>
                      <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.lunchType === 'roti_rice_combined' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="lunchType"
                          value="roti_rice_combined"
                          checked={formData.lunchType === 'roti_rice_combined'}
                          onChange={(e) => setFormData({ ...formData, lunchType: e.target.value as LunchType })}
                          className="w-5 h-5 text-orange-600 bg-slate-700 border-slate-600"
                        />
                        <span className="ml-3 text-white font-medium">Roti & Rice Combined</span>
                      </label>
                    </div>
                    {errors.lunchType && <p className="mt-4 text-sm text-red-400">{errors.lunchType}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Dinner Options */}
            {formData.mealType.includes('dinner') && (
              <div className="p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/50 animate-slide-down-transport">
                <label className="block text-lg font-semibold text-white mb-6">
                  Dinner Preference <span className="text-red-400">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(MEAL_PRICES).map(([key, price]) => (
                    <label
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.dinnerPreference === key 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-slate-600 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="dinnerPreference"
                          value={key}
                          checked={formData.dinnerPreference === key}
                          onChange={(e) => setFormData({ ...formData, dinnerPreference: e.target.value as MealPreference })}
                          className="w-5 h-5 text-orange-600 focus:ring-2 focus:ring-orange-500 bg-slate-700 border-slate-600"
                        />
                        <span className={`ml-3 font-medium capitalize ${key === 'none' ? 'text-gray-400 text-sm' : 'text-white'}`}>
                          {key === 'none' ? "I don't want to avail" : key}
                        </span>
                      </div>
                      {key !== 'none' && <span className="text-sm font-semibold text-orange-400">₹{price}</span>}
                    </label>
                  ))}
                </div>
                {errors.dinnerPreference && <p className="mt-4 text-sm text-red-400">{errors.dinnerPreference}</p>}

                {formData.dinnerPreference !== 'none' && (
                  <div className="mt-8 animate-slide-down-transport">
                    <label className="block text-lg font-semibold text-white mb-4">
                      I want (for dinner) <span className="text-red-400">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.dinnerType === 'roti_only' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="dinnerType"
                          value="roti_only"
                          checked={formData.dinnerType === 'roti_only'}
                          onChange={(e) => setFormData({ ...formData, dinnerType: e.target.value as DinnerType })}
                          className="w-5 h-5 text-orange-600 bg-slate-700 border-slate-600"
                        />
                        <span className="ml-3 text-white font-medium">Only Roti Meal</span>
                      </label>
                      <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.dinnerType === 'roti_rice_combined' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="dinnerType"
                          value="roti_rice_combined"
                          checked={formData.dinnerType === 'roti_rice_combined'}
                          onChange={(e) => setFormData({ ...formData, dinnerType: e.target.value as DinnerType })}
                          className="w-5 h-5 text-orange-600 bg-slate-700 border-slate-600"
                        />
                        <span className="ml-3 text-white font-medium">Roti & Rice Combined</span>
                      </label>
                    </div>
                    {errors.dinnerType && <p className="mt-4 text-sm text-red-400">{errors.dinnerType}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Total */}
            {calculateTotal() > 0 && (
              <div className="p-6 bg-gradient-to-r from-orange-900/30 to-orange-800/30 rounded-2xl border border-orange-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Amount</span>
                  <span className="text-3xl font-bold text-orange-400">₹{calculateTotal()}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">To be paid at the end of the month</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 px-8 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-orange-500/25 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Utensils className="w-6 h-6" />
                  <span>Submit Order</span>
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
              © {new Date().getFullYear()} Logile. Employee Food Ordering System.
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
            <h3 className="text-3xl font-bold text-white mb-4">Order Submitted!</h3>
            <p className="text-gray-400 text-lg">Your food order has been successfully placed.</p>
            <p className="text-sm text-gray-500 mt-4">A confirmation email has been sent.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
