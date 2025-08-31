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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Glass Orbs */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="glass-orb w-32 h-32 absolute top-20 left-10 animate-particle-float animation-delay-[1s]" />
        <div className="glass-orb w-24 h-24 absolute top-40 right-20 animate-particle-float animation-delay-[3s]" />
        <div className="glass-orb w-40 h-40 absolute bottom-32 left-1/4 animate-particle-float animation-delay-[5s]" />
        <div className="glass-orb w-20 h-20 absolute top-1/3 right-1/3 animate-particle-float animation-delay-[7s]" />
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90">
        <video
          className="w-full h-full object-contain"
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
        {/* Enhanced Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/90" />
        <div className="absolute inset-0 gradient-mesh" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {/* Main Glass Container */}
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center space-y-8 glass-hover animate-glass-morph">
          {/* Floating Logo Container */}
          <div className="floating-glass p-6 rounded-2xl animate-fade-in mb-8">
            <img
              src="https://ddjjtumgquimsgqwkgvd.supabase.co/storage/v1/object/public/hero/logo1.webp"
              alt="Solo Leveling"
              className="h-20 md:h-32 mx-auto animate-bounce-in animate-glow-pulse"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Main Heading with Glass Effect */}
          <div className="space-y-6 animate-slide-up relative">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in relative z-10">
              Solo Leveling
            </h1>
            <div className="glass-light p-4 rounded-xl animate-fade-in animation-delay-200">
              <p className="text-lg md:text-2xl text-foreground/90 max-w-2xl mx-auto">
                Advanced Healthcare AI Platform - Level Up Your Clinical Decision Making
              </p>
            </div>
          </div>

          {/* Floating Glass Badges */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-400">
            <div className="floating-glass px-6 py-3 rounded-full flex items-center space-x-2 glass-glow">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <div className="floating-glass px-6 py-3 rounded-full flex items-center space-x-2 glass-glow animation-delay-200">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="floating-glass px-6 py-3 rounded-full flex items-center space-x-2 glass-glow animation-delay-400">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-medium">Real-time Insights</span>
            </div>
          </div>

          {/* Glass CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-600">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="glass-heavy bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent transform hover:scale-110 transition-all duration-500 px-10 py-4 text-lg shadow-2xl hover:shadow-primary/50 animate-glow-pulse border-0 backdrop-blur-xl"
            >
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleLearnMore}
              className="glass-medium hover:glass-heavy px-10 py-4 text-lg transform hover:scale-105 transition-all duration-500 border-white/30 hover:border-white/50"
            >
              Learn More
              <ArrowDown className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="glass-light p-3 rounded-full animate-bounce animate-glow-pulse">
            <ArrowDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 glass-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Level Up Your Healthcare
              </h2>
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                Solo Leveling transforms healthcare delivery through advanced AI analysis, 
                real-time patient monitoring, and intelligent clinical decision support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enhanced Glass Feature Cards */}
            <div className="group floating-glass p-10 glass-hover animate-glass-morph">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full glass-glow bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:animate-glow-pulse transition-all duration-500">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">AI-Powered Analysis</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  Advanced machine learning algorithms analyze patient data to provide 
                  accurate risk assessments and clinical insights.
                </p>
              </div>
            </div>

            <div className="group floating-glass p-10 glass-hover animate-glass-morph animation-delay-200">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full glass-glow bg-gradient-to-r from-accent/80 to-primary/80 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:animate-glow-pulse transition-all duration-500">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent">Secure & Compliant</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  Built with enterprise-grade security and full HIPAA compliance 
                  to protect sensitive patient information.
                </p>
              </div>
            </div>

            <div className="group floating-glass p-10 glass-hover animate-glass-morph animation-delay-400">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full glass-glow bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center mb-6 group-hover:scale-125 group-hover:animate-glow-pulse transition-all duration-500">
                  <Activity className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Real-time Monitoring</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  Continuous patient monitoring with instant alerts for critical 
                  changes in patient status and risk factors.
                </p>
              </div>
            </div>
          </div>

          {/* Glass Bottom CTA */}
          <div className="text-center mt-20">
            <div className="glass-card p-8 inline-block">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="glass-heavy bg-gradient-to-r from-primary/90 to-accent/90 hover:from-primary hover:to-accent transform hover:scale-110 transition-all duration-500 px-16 py-6 text-xl shadow-2xl hover:shadow-primary/50 animate-glow-pulse border-0 backdrop-blur-xl"
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