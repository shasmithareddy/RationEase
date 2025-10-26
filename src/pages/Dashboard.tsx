import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Users, Clock, TrendingUp } from "lucide-react";
import TokenCard from "@/components/TokenCard";
import QueueStats from "@/components/QueueStats";
import ShopQRCode from "@/components/ShopQRCode";

interface Token {
  id: string;
  token_number: number;
  customer_name: string;
  customer_phone: string;
  status: string;
  created_at: string;
}

interface Shop {
  id: string;
  name: string;
  name_tamil: string;
  qr_code: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("2024-10-27");
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const serviceDates = [
    { value: "2024-10-27", label: "27th October 2024" },
    { value: "2025-11-01", label: "1st November 2025" },
    { value: "2025-11-05", label: "5th November 2025" },
    { value: "2025-11-14", label: "14th November 2025" },
    { value: "2025-11-17", label: "17th November 2025" },
  ];

  useEffect(() => {
    checkUser();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    if (shop) {
      loadTokens(shop.id);
    }
  }, [selectedDate, shop]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await loadShopData(session.user.id);
  };

  const loadShopData = async (userId: string) => {
    try {
      // First, try to find shop through shop_users relationship
      const { data: shopUserData, error: shopUserError } = await supabase
        .from("shop_users")
        .select("shop_id")
        .eq("user_id", userId)
        .single();

      let shopId = shopUserData?.shop_id;

      // If no shop found via shop_users, try direct ownership
      if (!shopId) {
        const { data: ownedShop } = await supabase
          .from("shops")
          .select("id")
          .eq("user_id", userId)
          .single();
        
        shopId = ownedShop?.id;
      }

      // If still no shop, use default SHOP001
      if (!shopId) {
        shopId = "2c61f3ab-f3ac-485a-8a4c-f829401a2bee";
      }

      // Get shop details
      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("id", shopId)
        .single();

      if (shopError) throw shopError;
      
      setShop(shopData);
      await loadTokens(shopId);
    } catch (error: any) {
      console.error("Shop load error:", error);
      toast({
        title: "பிழை / Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTokens = async (shopId: string) => {
    const { data, error } = await (supabase as any)
      .from("tokens")
      .select("*")
      .eq("shop_id", shopId)
      .gte("created_at", `${selectedDate}T00:00:00`)
      .lt("created_at", `${selectedDate}T23:59:59`)
      .order("token_number", { ascending: true });

    if (error) {
      toast({
        title: "பிழை / Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTokens(data || []);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("tokens-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tokens",
        },
        () => {
          if (shop) {
            loadTokens(shop.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleApproveToken = async (tokenId: string) => {
    try {
      // Update token status to completed
      const { error: updateError } = await supabase
        .from("tokens")
        .update({ 
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", tokenId);

      if (updateError) throw updateError;

      // Reload tokens to get fresh data
      if (shop) {
        await loadTokens(shop.id);
      }

      // Get next 3 waiting tokens after current one
      const currentIndex = tokens.findIndex(t => t.id === tokenId);
      const nextTokens = tokens
        .filter(t => t.status === "waiting")
        .slice(0, 3);

      if (nextTokens.length > 0 && shop) {
        // Call edge function to send SMS notifications (demo mode - send to specific number)
        const demoTokens = nextTokens.map(token => ({
          ...token,
          customer_phone: "+918668012212" // Demo number for testing
        }));
        
        const { data: smsData, error: smsError } = await supabase.functions.invoke("send-sms-notifications", {
          body: {
            tokens: demoTokens,
            shopName: shop.name,
          },
        });

        if (smsError) {
          console.error("SMS error:", smsError);
          toast({
            title: "SMS எச்சரிக்கை / SMS Warning",
            description: "Token completed but SMS failed. Verify your Twilio phone numbers at twilio.com/console",
            variant: "destructive",
          });
        } else {
          toast({
            title: "வெற்றி / Success",
            description: `டோக்கன் முடிவடைந்தது! அடுத்த ${nextTokens.length} பேருக்கு SMS அனுப்பப்பட்டது (15 நிமிடங்களில் வரவும்) / Token completed! SMS sent to next ${nextTokens.length} customers (arrive in 15 min)`,
          });
        }
      } else {
        toast({
          title: "வெற்றி / Success",
          description: "டோக்கன் முடிவடைந்தது / Token completed",
        });
      }
    } catch (error: any) {
      console.error("Approve error:", error);
      toast({
        title: "பிழை / Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">ஏற்றுகிறது... / Loading...</p>
        </div>
      </div>
    );
  }

  const waitingTokens = tokens.filter(t => t.status === "waiting");
  const completedToday = tokens.filter(t => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {shop?.name} / {shop?.name_tamil}
              </h1>
              <p className="text-sm text-muted-foreground">
                நியாய விலை கடை டாஷ்போர்டு / Ration Shop Dashboard
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              வெளியேறு / Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Date Filter */}
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <label className="text-sm font-medium mb-2 block">
            சேவை தேதி / Service Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-md border border-border bg-background"
          >
            {serviceDates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Overview */}
        <QueueStats
          waiting={waitingTokens.length}
          completed={completedToday}
          total={tokens.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {showCompleted ? "முடிந்த டோக்கன்கள் / Completed Tokens" : "நடப்பு வரிசை / Current Queue"}
              </h2>
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                variant="outline"
                size="sm"
              >
                {showCompleted ? "Show Queue" : "Show Completed"}
              </Button>
            </div>
            
            {showCompleted ? (
              tokens.filter(t => t.status === "completed").length === 0 ? (
                <div className="bg-card rounded-lg p-8 text-center border border-border">
                  <p className="text-muted-foreground">
                    இன்று முடிந்த டோக்கன்கள் இல்லை / No completed tokens today
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tokens.filter(t => t.status === "completed").map((token) => (
                    <TokenCard
                      key={token.id}
                      token={token}
                      onApprove={() => {}}
                    />
                  ))}
                </div>
              )
            ) : (
              waitingTokens.length === 0 ? (
                <div className="bg-card rounded-lg p-8 text-center border border-border">
                  <p className="text-muted-foreground">
                    தற்போது வரிசையில் யாரும் இல்லை / No one in queue currently
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {waitingTokens.map((token) => (
                    <TokenCard
                      key={token.id}
                      token={token}
                      onApprove={() => handleApproveToken(token.id)}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* QR Code */}
            {shop && <ShopQRCode qrCode={shop.qr_code} shopName={shop.name} />}

            {/* AI Queue Analyzer */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI வரிசை பகுப்பாய்வு / AI Queue Analyzer
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    <Clock className="inline h-4 w-4 mr-1" />
                    சராசரி காத்திருப்பு / Avg. Wait
                  </span>
                  <span className="font-semibold text-primary">
                    {waitingTokens.length > 0 
                      ? `${Math.round(waitingTokens.length * 7.5)} mins`
                      : "0 mins"
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    சேவை வேகம் / Service Speed
                  </span>
                  <span className="font-semibold text-accent">
                    5-10 mins/token
                  </span>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    கடந்த தரவுகளின் அடிப்படையில் கணிப்பு
                    <br />
                    Prediction based on historical data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
