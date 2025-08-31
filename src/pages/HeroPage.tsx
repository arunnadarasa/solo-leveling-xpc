import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowDown, Zap, Shield, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const HeroPage = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleLearnMore = () => {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

return (
    <div className="bg-background relative overflow-hidden">
      {/* Floating Glass Orbs - Extended across full page */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="glass-orb w-32 h-32 absolute top-20 left-10 animate-particle-float animation-delay-[1s]" />
        <div className="glass-orb w-24 h-24 absolute top-40 right-20 animate-particle-float animation-delay-[3s]" />
        <div className="glass-orb w-40 h-40 absolute bottom-32 left-1/4 animate-particle-float animation-delay-[5s]" />
        <div className="glass-orb w-20 h-20 absolute top-1/3 right-1/3 animate-particle-float animation-delay-[7s]" />
        {/* Additional orbs for features section */}
        <div className="glass-orb w-28 h-28 absolute bottom-96 right-10 animate-particle-float animation-delay-[2s]" />
        <div className="glass-orb w-36 h-36 absolute bottom-64 left-20 animate-particle-float animation-delay-[6s]" />
      </div>

      {/* Video Background - Full Page Coverage */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
      >
        <source
          src="https://ddjjtumgquimsgqwkgvd.supabase.co/storage/v1/object/public/hero/hero.mp4"
          type="video/mp4"
        />
      </video>
      {/* Enhanced overlay for better text readability - Full page coverage */}
      <div className="fixed inset-0 bg-black/40 z-[1]" />
      <div className="fixed inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30 z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {/* Main Glass Container with Enhanced Readability */}
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center space-y-8 glass-hover animate-glass-morph bg-background/30 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Floating Logo Container */}
          <div className="floating-glass p-6 rounded-2xl animate-fade-in mb-8 bg-background/40 backdrop-blur-lg border border-white/30">
            <img
              src="https://ddjjtumgquimsgqwkgvd.supabase.co/storage/v1/object/public/hero/logo1.webp"
              alt="Solo Leveling"
              className="h-20 md:h-32 mx-auto animate-bounce-in animate-glow-pulse drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Main Heading with Enhanced Glass Effect */}
          <div className="space-y-6 animate-slide-up relative">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in relative z-10 drop-shadow-lg [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Solo Leveling
            </h1>
            <div className="glass-light p-4 rounded-xl animate-fade-in animation-delay-200 bg-background/50 backdrop-blur-md border border-white/20 shadow-xl">
              <p className="text-lg md:text-2xl text-foreground max-w-2xl mx-auto font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">
                Advanced Healthcare AI Platform - Level Up Your Clinical Decision Making
              </p>
            </div>
          </div>

          {/* Enhanced Floating Glass Badges */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-400">
            <div className="floating-glass px-6 py-3 rounded-full flex items-center space-x-2 glass-glow bg-background/60 backdrop-blur-lg border border-white/30 shadow-lg">
              <Zap className="h-5 w-5 text-primary drop-shadow-sm" />
              <span className="font-medium text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">AI-Powered Analysis</span>
            </div>
            <div className="floating-glass px-6 py-3 rounded-full flex items-center space-x-2 glass-glow animation-delay-200 bg-background/60 backdrop-blur-lg border border-white/30 shadow-lg">
              <Shield className="h-5 w-5 text-accent drop-shadow-sm" />
              <span className="font-medium text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">HIPAA Compliant</span>
            </div>
            <div className="floating-glass px-6 py-3 rounded-full flex items-center space-x-2 glass-glow animation-delay-400 bg-background/60 backdrop-blur-lg border border-white/30 shadow-lg">
              <Activity className="h-5 w-5 text-primary drop-shadow-sm" />
              <span className="font-medium text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">Real-time Insights</span>
            </div>
          </div>

          {/* Enhanced Glass CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-600">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="glass-heavy bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-110 transition-all duration-500 px-10 py-4 text-lg shadow-2xl hover:shadow-primary/50 animate-glow-pulse border border-white/20 backdrop-blur-xl text-white font-semibold [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]"
            >
              <Play className="h-5 w-5 mr-2 drop-shadow-sm" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleLearnMore}
              className="glass-medium hover:glass-heavy px-10 py-4 text-lg transform hover:scale-105 transition-all duration-500 border-white/40 hover:border-white/60 bg-background/40 hover:bg-background/60 backdrop-blur-lg text-foreground font-semibold [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]"
            >
              Learn More
              <ArrowDown className="h-5 w-5 ml-2 drop-shadow-sm" />
            </Button>
          </div>
        </div>

        {/* Enhanced Floating Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="glass-light p-3 rounded-full animate-bounce animate-glow-pulse bg-background/50 backdrop-blur-lg border border-white/30 shadow-xl">
            <ArrowDown className="h-6 w-6 text-primary drop-shadow-sm" />
          </div>
        </div>
      </div>

      {/* Enhanced Features Section with Hero-level UX */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto bg-background/30 backdrop-blur-xl border border-white/20 shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                Level Up Your Healthcare
              </h2>
              <p className="text-xl text-foreground max-w-3xl mx-auto [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">
                Solo Leveling transforms healthcare delivery through advanced AI analysis, 
                real-time patient monitoring, and intelligent clinical decision support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enhanced Glass Feature Cards with Hero-level styling */}
            <div className="group floating-glass p-10 glass-hover animate-glass-morph bg-background/30 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full glass-glow bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:animate-glow-pulse transition-all duration-500 shadow-2xl">
                  <Zap className="h-10 w-10 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">AI-Powered Analysis</h3>
                <p className="text-foreground text-lg leading-relaxed [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
                  Advanced machine learning algorithms analyze patient data to provide 
                  accurate risk assessments and clinical insights.
                </p>
              </div>
            </div>

            <div className="group floating-glass p-10 glass-hover animate-glass-morph animation-delay-200 bg-background/30 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full glass-glow bg-gradient-to-r from-accent/80 to-primary/80 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:animate-glow-pulse transition-all duration-500 shadow-2xl">
                  <Shield className="h-10 w-10 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">Secure & Compliant</h3>
                <p className="text-foreground text-lg leading-relaxed [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
                  Built with enterprise-grade security and full HIPAA compliance 
                  to protect sensitive patient information.
                </p>
              </div>
            </div>

            <div className="group floating-glass p-10 glass-hover animate-glass-morph animation-delay-400 bg-background/30 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full glass-glow bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:animate-glow-pulse transition-all duration-500 shadow-2xl">
                  <Activity className="h-10 w-10 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">Real-time Monitoring</h3>
                <p className="text-foreground text-lg leading-relaxed [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
                  Continuous patient monitoring with instant alerts for critical 
                  changes in patient status and risk factors.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Glass Bottom CTA with Hero-level styling */}
          <div className="text-center mt-20">
            <div className="glass-card p-8 inline-block bg-background/30 backdrop-blur-xl border border-white/20 shadow-2xl">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="glass-heavy bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-110 transition-all duration-500 px-16 py-6 text-xl shadow-2xl hover:shadow-primary/50 animate-glow-pulse border border-white/20 backdrop-blur-xl text-white font-semibold [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]"
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;