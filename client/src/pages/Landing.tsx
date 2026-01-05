import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap, TrendingUp, Check } from "lucide-react";
import heroImage from "@assets/generated_images/abstract_professional_blue_green_glass_background.png";
import logoImage from "@assets/generated_images/minimalist_geometric_logo_icon_for_reputation_software.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900">ReputationAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Success Stories</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50">Log In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
           <img src={heroImage} alt="Background" className="w-full h-full object-cover opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/80 to-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Trusted by 500+ Local Businesses
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1]">
              Turn Google Reviews into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Revenue</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Automate your responses with AI, boost your local ranking, and watch your foot traffic grow. No tech skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-xl hover:shadow-2xl transition-all">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full">
                View ROI Demo
              </Button>
            </div>
            <div className="pt-4 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                 ))}
              </div>
              <p>Join 2,000+ restaurant owners today</p>
            </div>
          </div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
             {/* Abstract UI Mockup Composition */}
             <div className="relative w-full max-w-lg">
                {/* Back card */}
                <div className="absolute top-0 right-0 w-3/4 h-64 bg-emerald-100 rounded-2xl rotate-6 opacity-50 blur-sm" />
                {/* Main Dashboard Card Mockup */}
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
                   <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                   </div>
                   <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <div className="h-4 w-24 bg-slate-200 rounded" />
                            <div className="h-8 w-16 bg-slate-900 rounded" />
                         </div>
                         <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="h-20 w-full bg-blue-50 rounded-xl border border-blue-100 p-3">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="h-6 w-6 rounded-full bg-blue-500" />
                               <div className="h-3 w-20 bg-blue-200 rounded" />
                            </div>
                            <div className="h-2 w-full bg-blue-200 rounded mb-1" />
                            <div className="h-2 w-2/3 bg-blue-200 rounded" />
                         </div>
                      </div>
                   </div>
                </div>
                
                {/* Floating Element */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-[3000ms]">
                   <div className="bg-emerald-100 p-2 rounded-lg">
                      <Star className="h-6 w-6 text-emerald-600 fill-emerald-600" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">New 5-Star Review!</p>
                      <p className="text-xs text-slate-500">Just now • Auto-responded</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-slate-50" id="features">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Why top restaurants trust us</h2>
               <p className="text-slate-600 text-lg">We handle the digital noise so you can focus on the food and service.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 {
                   icon: Zap,
                   title: "AI Auto-Response",
                   desc: "Our AI reads reviews and drafts personalized, human-like responses in seconds. You just click 'Approve'."
                 },
                 {
                   icon: Shield,
                   title: "Brand Protection",
                   desc: "Catch negative reviews instantly. Get alerts before they go viral and resolve issues privately."
                 },
                 {
                   icon: TrendingUp,
                   title: "Revenue Tracking",
                   desc: "Connect your reviews to actual foot traffic and revenue. See the real dollar value of your reputation."
                 }
               ].map((feature, i) => (
                 <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                       <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 bg-white/10 rounded-lg" />
                  <span className="font-heading font-bold text-xl text-white">ReputationAI</span>
               </div>
               <p className="max-w-xs text-sm">Helping local businesses grow through better customer relationships and automated reputation management.</p>
            </div>
            <div>
               <h4 className="font-bold text-white mb-4">Product</h4>
               <ul className="space-y-2 text-sm">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Case Studies</li>
                  <li>API</li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-4">Company</h4>
               <ul className="space-y-2 text-sm">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                  <li>Contact</li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}