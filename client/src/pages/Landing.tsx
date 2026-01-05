import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap, TrendingUp, Globe } from "lucide-react";
import heroImage from "@assets/generated_images/abstract_professional_blue_green_glass_background.png";
import logoImage from "@assets/generated_images/minimalist_geometric_logo_icon_for_reputation_software.png";
import { useState } from "react";

export default function Landing() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const content = {
    fr: {
      nav: ["Fonctionnalités", "Success Stories", "Tarifs"],
      login: "Connexion",
      start: "Démarrer",
      badge: "Approuvé par +500 Commerces",
      heroTitle: "Transformez vos Avis Google en ",
      heroTitleAccent: "Chiffre d'Affaires",
      heroDesc: "Automatisez vos réponses avec l'IA, boostez votre référencement local et augmentez votre trafic en magasin. Aucune compétence technique requise.",
      ctaStart: "Essai Gratuit",
      ctaDemo: "Voir Démo ROI",
      join: "Rejoignez +2,000 restaurateurs",
      featuresTitle: "Pourquoi les meilleurs nous font confiance",
      featuresDesc: "Nous gérons le bruit numérique pour que vous puissiez vous concentrer sur votre cuisine.",
      feat1: { t: "Auto-Réponse IA", d: "Notre IA génère des réponses personnalisées et humaines en quelques secondes. Vous n'avez qu'à cliquer sur 'Approuver'." },
      feat2: { t: "Protection de Marque", d: "Détectez les avis négatifs instantanément. Soyez alerté avant qu'ils ne deviennent viraux." },
      feat3: { t: "Suivi du ROI", d: "Reliez vos avis au trafic réel et à votre CA. Visualisez la valeur monétaire réelle de votre réputation." }
    },
    en: {
      nav: ["Features", "Success Stories", "Pricing"],
      login: "Log In",
      start: "Get Started",
      badge: "Trusted by 500+ Local Businesses",
      heroTitle: "Turn Google Reviews into ",
      heroTitleAccent: "Revenue",
      heroDesc: "Automate your responses with AI, boost your local ranking, and watch your foot traffic grow. No tech skills required.",
      ctaStart: "Free Trial",
      ctaDemo: "View ROI Demo",
      join: "Join 2,000+ restaurant owners today",
      featuresTitle: "Why top businesses trust us",
      featuresDesc: "We handle the digital noise so you can focus on your craft and service.",
      feat1: { t: "AI Auto-Response", d: "Our AI drafts personalized, human-like responses in seconds. You just click 'Approve'." },
      feat2: { t: "Brand Protection", d: "Catch negative reviews instantly. Get alerts before they go viral and resolve issues privately." },
      feat3: { t: "Revenue Tracking", d: "Connect your reviews to actual foot traffic and revenue. See the real dollar value of your reputation." }
    }
  };

  const t = content[lang];

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
            {t.nav.map(item => <a key={item} href="#" className="hover:text-blue-600 transition-colors">{item}</a>)}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mr-2 border border-slate-200 px-2 py-1 rounded"
            >
              <Globe className="h-3 w-3" /> {lang.toUpperCase()}
            </button>
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50">{t.login}</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 rounded-full px-6">
                {t.start}
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
              {t.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1]">
              {t.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">{t.heroTitleAccent}</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-xl hover:shadow-2xl transition-all">
                  {t.ctaStart} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full">
                {t.ctaDemo}
              </Button>
            </div>
            <div className="pt-4 flex items-center gap-4 text-sm text-slate-500">
              <p>{t.join}</p>
            </div>
          </div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
             <div className="relative bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Star className="h-6 w-6 text-emerald-600 fill-emerald-600" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">{lang === 'fr' ? 'Nouvel Avis 5 Étoiles !' : 'New 5-Star Review!'}</p>
                      <p className="text-xs text-slate-500">Auto-responded by AI</p>
                   </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded mb-2" />
                <div className="h-2 w-4/5 bg-slate-100 rounded mb-2" />
                <div className="h-2 w-2/3 bg-slate-100 rounded" />
             </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">{t.featuresTitle}</h2>
               <p className="text-slate-600 text-lg">{t.featuresDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { icon: Zap, title: t.feat1.t, desc: t.feat1.d },
                 { icon: Shield, title: t.feat2.t, desc: t.feat2.d },
                 { icon: TrendingUp, title: t.feat3.t, desc: t.feat3.d }
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
    </div>
  );
}