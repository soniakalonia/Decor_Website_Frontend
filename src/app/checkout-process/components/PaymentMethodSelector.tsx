'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  processingTime: string;
}

interface PaymentMethodSelectorProps {
  onPaymentSelect: (methodId: string) => void;
  selectedMethodId: string | null;
}

const PaymentMethodSelector = ({ onPaymentSelect, selectedMethodId }: PaymentMethodSelectorProps) => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: 'DevicePhoneMobileIcon',
      description: 'Pay using Google Pay, PhonePe, Paytm, or any UPI app',
      processingTime: 'Instant',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'BuildingLibraryIcon',
      description: 'Pay securely using your bank account',
      processingTime: 'Instant',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'CreditCardIcon',
      description: 'Visa, Mastercard, RuPay, and American Express accepted',
      processingTime: 'Instant',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'BanknotesIcon',
      description: 'Pay when you receive your order',
      processingTime: '₹50 extra charges apply',
    },
  ];

  const [showCardForm, setShowCardForm] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);

  const handleMethodSelect = (methodId: string) => {
    onPaymentSelect(methodId);
    setShowCardForm(methodId === 'card');
    setShowUpiForm(methodId === 'upi');
  };

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Payment Method
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id}>
            <div
              onClick={() => handleMethodSelect(method.id)}
              className={`cursor-pointer rounded-md border-2 p-4 transition-smooth ${
                selectedMethodId === method.id
                  ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon name={method.icon as any} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="caption mt-1 text-muted-foreground">{method.description}</p>
                    <p className="caption mt-1 flex items-center space-x-1 text-success">
                      <Icon name="ClockIcon" size={14} />
                      <span>{method.processingTime}</span>
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-smooth ${
                      selectedMethodId === method.id
                        ? 'border-primary bg-primary' :'border-border bg-background'
                    }`}
                  >
                    {selectedMethodId === method.id && (
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedMethodId === method.id && method.id === 'upi' && showUpiForm && (
              <div className="mt-3 rounded-md bg-muted p-4">
                <label htmlFor="upiId" className="mb-2 block text-sm font-medium text-foreground">
                  Enter UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  placeholder="yourname@upi"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="caption mt-2 text-muted-foreground">
                  You will receive a payment request on your UPI app
                </p>
              </div>
            )}

            {selectedMethodId === method.id && method.id === 'card' && showCardForm && (
              <div className="mt-3 space-y-3 rounded-md bg-muted p-4">
                <div>
                  <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium text-foreground">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cardExpiry" className="mb-1 block text-sm font-medium text-foreground">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="mb-1 block text-sm font-medium text-foreground">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cardCvv"
                      placeholder="123"
                      maxLength={3}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-success/10 p-3">
                  <Icon name="ShieldCheckIcon" size={20} className="text-success" />
                  <p className="caption text-success">
                    Your card details are encrypted and secure
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-md bg-muted p-4">
        <div className="flex items-start space-x-3">
          <Icon name="ShieldCheckIcon" size={24} className="flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Secure Payment</p>
            <p className="caption mt-1 text-muted-foreground">
              All transactions are encrypted and processed through secure payment gateways. Your financial information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;



