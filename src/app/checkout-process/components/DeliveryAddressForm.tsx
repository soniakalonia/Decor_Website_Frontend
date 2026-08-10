'use client';

import { useState, useEffect } from 'react';
import { useGetUserAddressesQuery, useAddAddressMutation, useSetDefaultAddressMutation } from '@/store/api/orderApi';
import { toast } from 'react-toastify';
import Icon from '@/components/ui/AppIcon';

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface DeliveryAddressFormProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId: string | null;
}

const DeliveryAddressForm = ({ onAddressSelect, selectedAddressId }: DeliveryAddressFormProps) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: addressesData, isLoading, refetch } = useGetUserAddressesQuery(undefined);
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  
  const savedAddresses = (addressesData?.addresses || []).map((addr: any) => ({
    id: String(addr.id),
    name: addr.name,
    phone: addr.phone,
    addressLine1: addr.address_line1,
    addressLine2: addr.address_line2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    isDefault: Boolean(addr.is_default),
  }));
  
  const defaultAddress = savedAddresses.find((addr: any) => addr.isDefault) || savedAddresses[0];

  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      onAddressSelect(defaultAddress);
    }
  }, [defaultAddress, selectedAddressId]);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ];

  const validatePincode = (pincode: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pincode);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = 'Enter valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addAddress(formData).unwrap();
        await refetch();
        toast.success('Address added successfully');
        setShowAddressForm(false);
        setFormData({
          name: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
        });
      } catch {
        toast.error('Failed to add address');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId).unwrap();
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default address');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Delivery Address
        </h2>
        <button
          onClick={() => setShowAddressForm(!showAddressForm)}
          className="flex items-center space-x-2 text-sm font-medium text-primary transition-smooth hover:text-primary/80"
        >
          <Icon name={showAddressForm ? 'XMarkIcon' : 'PlusIcon'} size={20} />
          <span>{showAddressForm ? 'Cancel' : 'Add New Address'}</span>
        </button>
      </div>

      {showAddressForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md bg-muted p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="10-digit mobile number"
              />
              {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="addressLine1" className="mb-1 block text-sm font-medium text-foreground">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="House No., Building Name"
            />
            {errors.addressLine1 && <p className="mt-1 text-xs text-error">{errors.addressLine1}</p>}
          </div>

          <div>
            <label htmlFor="addressLine2" className="mb-1 block text-sm font-medium text-foreground">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Road Name, Area, Colony"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-foreground">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="City"
              />
              {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium text-foreground">
                State *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-xs text-error">{errors.state}</p>}
            </div>

            <div>
              <label htmlFor="pincode" className="mb-1 block text-sm font-medium text-foreground">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength={6}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="6-digit pincode"
              />
              {errors.pincode && <p className="mt-1 text-xs text-error">{errors.pincode}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isAdding}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] disabled:opacity-50"
          >
            {isAdding ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-md bg-muted p-4 animate-pulse h-24" />
          ) : savedAddresses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No saved addresses. Add a new address to continue.</p>
          ) : !showAllAddresses && defaultAddress ? (
            <>
              <div className="cursor-pointer rounded-md border-2 border-primary bg-primary/5 p-4 transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground">{defaultAddress.name}</p>
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                        Default
                      </span>
                    </div>
                    <p className="caption mt-1 text-muted-foreground">{defaultAddress.phone}</p>
                    <p className="mt-2 text-sm text-foreground">
                      {defaultAddress.addressLine1}
                      {defaultAddress.addressLine2 && `, ${defaultAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-foreground">
                      {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                    </p>
                  </div>
                  <Icon name="CheckCircleIcon" size={24} className="text-primary" variant="solid" />
                </div>
              </div>
              {savedAddresses.length > 1 && (
                <button
                  onClick={() => setShowAllAddresses(true)}
                  className="w-full rounded-md border-2 border-dashed border-border bg-card p-4 text-sm font-medium text-primary transition-smooth hover:border-primary hover:bg-primary/5"
                >
                  Change Address ({savedAddresses.length - 1} more available)
                </button>
              )}
            </>
          ) : (
            savedAddresses.map((address: any) => (
              <div
                key={address.id}
                onClick={() => onAddressSelect(address)}
                className={`cursor-pointer rounded-md border-2 p-4 transition-smooth ${
                  selectedAddressId === address.id
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground">{address.name}</p>
                      {address.isDefault && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="caption mt-1 text-muted-foreground">{address.phone}</p>
                    <p className="mt-2 text-sm text-foreground">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-sm text-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {!address.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address.id);
                        }}
                        className="mt-2 text-xs font-medium text-primary transition-smooth hover:text-primary/80"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {selectedAddressId === address.id && (
                      <Icon name="CheckCircleIcon" size={24} className="text-primary" variant="solid" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressForm;

