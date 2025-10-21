import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Phone, User } from "lucide-react";

interface TokenCardProps {
  token: {
    id: string;
    token_number: number;
    customer_name: string;
    customer_phone: string;
    status: string;
    created_at: string;
  };
  onApprove: () => void;
}

const TokenCard = ({ token, onApprove }: TokenCardProps) => {
  const getStatusBadge = () => {
    switch (token.status) {
      case "waiting":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">காத்திருக்கும் / Waiting</Badge>;
      case "called":
        return <Badge className="bg-green-500 hover:bg-green-600">அழைக்கப்பட்டது / Called</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">முடிந்தது / Completed</Badge>;
      default:
        return <Badge variant="secondary">{token.status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full p-3 text-center min-w-[60px]">
              <div className="text-2xl font-bold text-primary">
                #{token.token_number}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{token.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{token.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
              </div>
            </div>
          </div>
          {token.status === "waiting" && (
            <Button
              onClick={onApprove}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              அனுமதி / Approve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
