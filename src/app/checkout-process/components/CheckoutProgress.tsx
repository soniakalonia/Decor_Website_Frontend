import Icon from '@/components/ui/AppIcon';

interface Step {
  id: number;
  name: string;
  icon: string;
}

interface CheckoutProgressProps {
  currentStep: number;
}

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  const steps: Step[] = [
    { id: 1, name: 'Address', icon: 'MapPinIcon' },
    { id: 2, name: 'Payment', icon: 'CreditCardIcon' },
    { id: 3, name: 'Review', icon: 'ClipboardDocumentCheckIcon' },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-smooth ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Icon name="CheckIcon" size={20} />
                ) : (
                  <Icon name={step.icon as any} size={20} />
                )}
              </div>
              <p
                className={`caption mt-2 text-center ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 transition-smooth ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;



