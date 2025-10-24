import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Users } from "lucide-react";

const JoinQueue = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const [shop, setShop] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadShop();
  }, [qrCode]);

  const loadShop = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("shops")
        .select("*")
        .eq("qr_code", qrCode)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({
          title: "பிழை / Error",
          description: "கடை கிடைக்கவில்லை / Shop not found",
          variant: "destructive",
        });
        return;
      }

      setShop(data);
    } catch (error: any) {
      console.error("Error loading shop:", error);
    }
  };

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shop) return;
    
    setLoading(true);

    try {
      // Get next token number
      const { data: functionData, error: functionError } = await (supabase as any)
        .rpc("get_next_token_number", { p_shop_id: shop.id });

      if (functionError) throw functionError;

      const nextTokenNumber = functionData;

      // Insert new token
      const { data: newToken, error: insertError } = await (supabase as any)
        .from("tokens")
        .insert({
          shop_id: shop.id,
          token_number: nextTokenNumber,
          customer_name: customerName,
          customer_phone: customerPhone,
          status: "waiting",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Get current queue position
      const { data: waitingTokens, error: queueError } = await (supabase as any)
        .from("tokens")
        .select("id")
        .eq("shop_id", shop.id)
        .eq("status", "waiting")
        .order("token_number", { ascending: true });

      if (queueError) throw queueError;

      const position = waitingTokens?.findIndex((t: any) => t.id === newToken?.id) + 1;

      setTokenNumber(nextTokenNumber);
      setQueuePosition(position || 1);

      toast({
        title: "வெற்றி! / Success!",
        description: `டோக்கன் #${nextTokenNumber} ஒதுக்கப்பட்டது / Token #${nextTokenNumber} assigned`,
      });
    } catch (error: any) {
      toast({
        title: "பிழை / Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">ஏற்றுகிறது... / Loading...</p>
        </div>
      </div>
    );
  }

  if (tokenNumber !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 dark:bg-green-900/20 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              டோக்கன் ஒதுக்கப்பட்டது!
              <br />
              Token Assigned!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-primary/10 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">உங்கள் டோக்கன் எண் / Your Token Number</p>
              <p className="text-6xl font-bold text-primary">#{tokenNumber}</p>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">கடை / Shop:</span>
                <span className="font-semibold">{shop.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">இருப்பிடம் / Location:</span>
                <span className="font-semibold">{shop.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  வரிசை நிலை / Queue Position:
                </span>
                <span className="font-semibold text-primary">#{queuePosition}</span>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                📱 உங்கள் முறை நெருங்கும்போது SMS அறிவிப்பு பெறுவீர்கள்
                <br />
                You will receive an SMS notification when your turn approaches
              </p>
            </div>

            <Button
              onClick={() => navigate("/")}
              className="w-full"
              size="lg"
            >
              முகப்புக்குத் திரும்பு / Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {shop.name}
          </CardTitle>
          <CardDescription className="text-center">
            {shop.name_tamil}
            <br />
            <span className="text-xs">{shop.location} / {shop.location_tamil}</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleJoinQueue}>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <p className="text-sm text-center text-muted-foreground">
                வரிசையில் சேர உங்கள் விவரங்களை உள்ளிடவும்
                <br />
                Enter your details to join the queue
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">பெயர் / Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="உங்கள் பெயர் / Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">தொலைபேசி எண் / Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                disabled={loading}
                pattern="[+]?[0-9]{10,15}"
              />
              <p className="text-xs text-muted-foreground">
                SMS அறிவிப்புகளுக்கு / For SMS notifications
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              வரிசையில் சேரவும் / Join Queue
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default JoinQueue;
