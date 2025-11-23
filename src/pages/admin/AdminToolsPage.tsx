import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminToolsPage() {
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAssignAllAdmins = async () => {
    try {
      setIsAssigning(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('assign-all-admins', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: data.message || "All users have been granted admin access",
      });

    } catch (error: any) {
      console.error("Error assigning admin roles:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin roles",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
          className="mb-6"
        >
          ← Back to Admin Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Tools</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Grant All Admin Access
              </CardTitle>
              <CardDescription>
                Assign admin privileges to all registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAssignAllAdmins}
                disabled={isAssigning}
                className="w-full"
              >
                {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAssigning ? "Assigning..." : "Grant Admin Access to All"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
