'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PaystackButtonProps {
  amount: number;
  email: string;
  orderId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  disabled?: boolean;
}

const PaystackButton = ({ 
  amount, 
  email, 
  orderId, 
  onSuccess, 
  onClose, 
  disabled = false 
}: PaystackButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    
    if (!publicKey) {
      toast.error('Payment gateway not configured. Please contact support.');
      return;
    }

    setLoading(true);

    // Load Paystack script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const PaystackPop = (window as any).PaystackPop;
      
      const handler = PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo
        currency: 'NGN',
        ref: orderId,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        onSuccess: async (transaction: any) => {
          setLoading(false);
          toast.success('Payment successful! Order is now being processed.');
          
          // Auto-update order in background
          try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/orders/${orderId}/pay`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                reference: transaction.reference,
                status: 'success',
                gateway_response: 'Payment successful'
              })
            });
          } catch (error) {
            console.log('Background update failed:', error);
          }
          
          onSuccess?.();
        },
        onCancel: () => {
          setLoading(false);
          toast.error('Payment cancelled');
          onClose?.();
        }
      });
      
      handler.openIframe();
    };
    
    script.onerror = () => {
      setLoading(false);
      toast.error('Failed to load payment gateway');
    };
    
    document.head.appendChild(script);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <span>Pay ₦{amount.toLocaleString()}</span>
          <span className="ml-2">💳</span>
        </>
      )}
    </button>
  );
};

export default PaystackButton;
