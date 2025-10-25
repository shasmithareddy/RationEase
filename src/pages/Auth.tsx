import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use email format from phone for auth (phone@rationqueue.app)
      const email = `${phone.replace(/\+/g, '')}@rationqueue.app`;
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              phone,
              full_name: fullName,
              role: isShopOwner ? 'shop_owner' : 'customer',
            },
          },
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              phone,
              full_name: fullName,
              role: isShopOwner ? 'shop_owner' : 'customer',
            });

          if (profileError) throw profileError;

          // If shop owner, link to sample shop
          if (isShopOwner) {
            const { data: shopData } = await supabase
              .from('shops')
              .select('id')
              .eq('qr_code', 'SHOP001')
              .single();

            if (shopData) {
              await supabase.from('shop_users').insert({
                user_id: data.user.id,
                shop_id: shopData.id,
              });
            }
          }
        }

        toast({
          title: "வெற்றி / Success",
          description: "கணக்கு உருவாக்கப்பட்டது! / Account created!",
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "வெற்றி / Success",
          description: "உள்நுழைவு வெற்றி / Login successful!",
        });
        navigate("/dashboard");
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            RationQueue
          </CardTitle>
          <CardDescription className="text-center text-base">
            நியாய விலை கடை வரிசை மேலாண்மை
            <br />
            Ration Shop Queue Management
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">மொபைல் எண் / Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">பெயர் / Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="உங்கள் பெயர் / Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="shopOwner"
                    checked={isShopOwner}
                    onChange={(e) => setIsShopOwner(e.target.checked)}
                    className="rounded border-gray-300"
                    disabled={loading}
                  />
                  <Label htmlFor="shopOwner" className="text-sm cursor-pointer">
                    கடை உரிமையாளர் / Shop Owner
                  </Label>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">கடவுச்சொல் / Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? "பதிவு செய்க / Sign Up" : "உள்நுழைக / Login"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp
                ? "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக / Already have an account? Login"
                : "புதிய கணக்கு? பதிவு செய்க / New account? Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
