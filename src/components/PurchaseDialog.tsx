import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Phone, User, Mail, CheckCircle } from 'lucide-react';

const purchaseSchema = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phoneNumber: z.string()
    .trim()
    .regex(/^(0[67]\d{8}|\+255[67]\d{8})$/, 'Enter a valid Tanzanian phone number (e.g., 0756377013 or +255756377013)'),
  email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: {
    id: string;
    title: string;
    price: number;
  } | null;
}

const MPESA_NUMBER = '0756377013';

export const PurchaseDialog = ({ open, onOpenChange, material }: PurchaseDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      customerName: '',
      phoneNumber: '',
      email: '',
    },
  });

  const formatPhoneForUSSD = (phone: string): string => {
    // Remove + and any spaces
    let cleaned = phone.replace(/[\s+]/g, '');
    // Convert +255 to 0
    if (cleaned.startsWith('255')) {
      cleaned = '0' + cleaned.slice(3);
    }
    return cleaned;
  };

  const triggerMpesaPayment = (amount: number) => {
    // Format: *150*00*1*1*recipient*amount#
    // This is the Vodacom Tanzania M-Pesa format for sending money
    const ussdCode = `*150*00*1*1*${MPESA_NUMBER}*${Math.round(amount)}#`;
    
    // Try to open the dialer with the USSD code
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
  };

  const onSubmit = async (data: PurchaseFormData) => {
    if (!material) return;

    setIsSubmitting(true);
    try {
      const { data: purchase, error } = await supabase
        .from('store_purchases')
        .insert({
          material_id: material.id,
          customer_name: data.customerName,
          phone_number: formatPhoneForUSSD(data.phoneNumber),
          email: data.email || null,
          amount: material.price,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) throw error;

      setPurchaseId(purchase.id);
      setPurchaseComplete(true);

      // Trigger M-Pesa USSD
      setTimeout(() => {
        triggerMpesaPayment(material.price);
      }, 500);

    } catch (error) {
      console.error('Error creating purchase:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setPurchaseComplete(false);
      setPurchaseId(null);
      form.reset();
    }, 300);
  };

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!purchaseComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Material</DialogTitle>
              <DialogDescription>
                Enter your details to purchase "{material.title}"
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-medium">{material.title}</p>
              <p className="text-2xl font-bold text-primary">
                TZS {material.price.toLocaleString()}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Your full name" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>M-Pesa Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="0756377013" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="your@email.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Order Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your M-Pesa menu should open automatically. If not, please send the payment manually.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-left space-y-2 mb-4">
              <p className="font-medium">Payment Instructions:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Dial *150*00#</li>
                <li>Select "1" for Send Money</li>
                <li>Enter number: <span className="font-mono font-bold">{MPESA_NUMBER}</span></li>
                <li>Enter amount: <span className="font-mono font-bold">TZS {material.price.toLocaleString()}</span></li>
                <li>Confirm with your PIN</li>
              </ol>
              {purchaseId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Reference: {purchaseId.slice(0, 8).toUpperCase()}
                </p>
              )}
            </div>

            <Button onClick={() => triggerMpesaPayment(material.price)} variant="outline" className="w-full mb-2">
              <Phone className="h-4 w-4 mr-2" />
              Open M-Pesa Menu Again
            </Button>
            
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
