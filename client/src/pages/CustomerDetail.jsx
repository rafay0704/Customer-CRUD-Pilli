import { useParams, useNavigate } from "react-router-dom";
import { useCustomers } from "../hooks/useCustomers";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCustomerById } = useCustomers();
  const customer = getCustomerById(id);

  if (!customer) return <p className="text-center py-10">Loading customer details...</p>;

  const initials = customer.name
    ? customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "👤";

  return (
    <div className="w-[95%] max-w-3xl mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>

      <Card className="shadow-md border">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              {customer.image?.url ? (
                <AvatarImage src={customer.image.url} alt={customer.name} />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground">{initials}</AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="text-2xl font-bold">{customer.name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-muted-foreground">Email</p>
            <p>{customer.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-muted-foreground">Phone</p>
            <p>{customer.phone || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-muted-foreground">Company</p>
            <p>{customer.company || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-muted-foreground">Address</p>
            <p>{customer.address || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold text-muted-foreground">Notes</p>
            <p>{customer.notes || "No notes available."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetail;
