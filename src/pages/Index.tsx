import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            RationQueue Smart Dashboard
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            நியாய விலை கடை வரிசை மேலாண்மை அமைப்பு
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            Transform your ration shop queue management with AI-powered analytics, 
            real-time updates, and SMS notifications for a seamless distribution experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
            <Button 
              size="lg" 
              className="text-lg bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all"
              onClick={() => navigate("/auth")}
            >
              உள்நுழைக / Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg"
              onClick={() => navigate("/auth")}
            >
              பதிவு செய்க / Sign Up
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <div className="bg-card rounded-lg p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              நேரடி வரிசை / Live Queue
            </h3>
            <p className="text-muted-foreground">
              Real-time queue updates with automatic token management and status tracking.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              SMS அறிவிப்புகள் / SMS Alerts
            </h3>
            <p className="text-muted-foreground">
              Automatic SMS notifications sent to the next 3-4 customers when a token is approved.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              AI பகுப்பாய்வு / AI Analytics
            </h3>
            <p className="text-muted-foreground">
              ML-powered waiting time predictions based on queue patterns and service speed.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-9 duration-1000 delay-1000">
          <h2 className="text-3xl font-bold">
            நன்மைகள் / Benefits
          </h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                கூட்ட நெரிசலைத் தவிர்க்க / Prevent crowding at shops
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                திறந்தவெளி விநியோகம் / Transparent distribution
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                நேரத்தை மிச்சப்படுத்து / Save time for customers
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <p className="text-muted-foreground">
                டிஜிட்டல் டோக்கன் அமைப்பு / Digital token system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
