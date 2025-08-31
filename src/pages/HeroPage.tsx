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
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
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
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="animate-fade-in">
            <img
              src="https://ddjjtumgquimsgqwkgvd.supabase.co/storage/v1/object/public/hero/logo1.webp"
              alt="Solo Leveling"
              className="h-20 md:h-32 mx-auto mb-6 animate-bounce-in"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Main Heading */}
          <div className="space-y-4 animate-slide-up">
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Solo Leveling
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-200">
              Advanced Healthcare AI Platform - Level Up Your Clinical Decision Making
            </p>
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in animation-delay-400">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Insights
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-600">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg shadow-xl hover:shadow-2xl"
            >
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleLearnMore}
              className="border-2 hover:bg-accent/10 px-8 py-3 text-lg backdrop-blur-sm"
            >
              Learn More
              <ArrowDown className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Level Up Your Healthcare
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Solo Leveling transforms healthcare delivery through advanced AI analysis, 
              real-time patient monitoring, and intelligent clinical decision support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="group p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced machine learning algorithms analyze patient data to provide 
                  accurate risk assessments and clinical insights.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
                <p className="text-muted-foreground">
                  Built with enterprise-grade security and full HIPAA compliance 
                  to protect sensitive patient information.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Continuous patient monitoring with instant alerts for critical 
                  changes in patient status and risk factors.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 px-12 py-4 text-lg shadow-xl hover:shadow-2xl"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;