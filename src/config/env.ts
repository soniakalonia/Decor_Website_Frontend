export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.vmrsolution.in/api',
  appName: 'Decor Vault',
  version: '1.0.0',
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },
  payment: {
    successUrl: process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL || '/payment/success',
    failureUrl: process.env.NEXT_PUBLIC_PAYMENT_FAILURE_URL || '/payment/failure',
  }
}