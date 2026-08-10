'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface OrderActionsProps {
  orderId: string;
  canCancel: boolean;
  canReturn: boolean;
  invoiceUrl: string;
}

const OrderActions = ({ orderId, canCancel, canReturn }: OrderActionsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleDownloadInvoice = async () => {
    if (!isHydrated) return;
    const orderIdNum = orderId.replace('ORD', '');
    const token = localStorage.getItem('auth_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${API_URL}/orders/${orderIdNum}/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        const invoice = data.invoice;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const rupee = '&#8377;';
          const formatCurrency = (value: number) => (Number.isFinite(value) ? value.toFixed(2) : '0.00');
          const safe = (value: any) => (value === null || value === undefined ? '' : String(value));
          const address = invoice.address || {};
          const addressLine1 = address.addressLine1 || address.address_line1 || '';
          const addressLine2 = address.addressLine2 || address.address_line2 || '';
          const city = address.city || '';
          const state = address.state || '';
          const pincode = address.pincode || '';
          const addressPrimary = [addressLine1, addressLine2].filter(Boolean).join(', ');
          const addressSecondary = [city, state].filter(Boolean).join(', ');
          const addressFull = [addressPrimary, addressSecondary].filter(Boolean).join(', ');
          const addressWithPin = addressFull ? `${addressFull}${pincode ? ` - ${pincode}` : ''}` : (pincode ? pincode : 'N/A');
          const items = Array.isArray(invoice.items) ? invoice.items : [];
          const subtotal = Number(invoice.subtotal || 0);
          const gst = Number(invoice.gst || 0);
          const deliveryCharges = Number(invoice.deliveryCharges || 0);
          const discount = Number(invoice.discount || 0);
          const total = Number(invoice.total || 0);
          const orderDate = safe(invoice.orderDate);
          const qrData = `${window.location.origin}/order-tracking?orderId=${orderIdNum}`;
          const fallbackRow = '<tr><td class="table-cell" colspan="5">No items found</td></tr>';
          const itemRows = items.map((item: any, index: number) => {
            const qty = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const lineTotal = Number(item.total || qty * price || 0);
            return `
              <tr>
                <td class="table-cell">${index + 1}</td>
                <td class="table-cell">
                  <div class="item-name">${safe(item.name) || 'Product'}</div>
                </td>
                <td class="table-cell text-center">${qty}</td>
                <td class="table-cell text-right">${rupee}${formatCurrency(price)}</td>
                <td class="table-cell text-right">${rupee}${formatCurrency(lineTotal)}</td>
              </tr>
            `;
          }).join('');

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Invoice - ${safe(invoice.orderNumber)}</title>
                <style>
                  * { box-sizing: border-box; }
                  body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.3; margin: 0; background: #f2f2f2; color: #000; }
                  .toolbar { display: flex; justify-content: flex-end; gap: 10px; padding: 10px 16px; background: #fff; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 1; }
                  .btn { padding: 8px 12px; border: 1px solid #333; background: #fff; cursor: pointer; font-size: 12px; border-radius: 4px; }
                  .btn.primary { background: #111; color: #fff; }
                  .page { width: 210mm; min-height: 297mm; margin: 16px auto; background: #fff; border: 1px solid #000; }
                  .section { border-bottom: 1px solid #000; padding: 10px 14px; }
                  .section:last-child { border-bottom: none; }
                  .title { text-align: center; font-size: 18px; font-weight: 700; padding: 10px 0; border-bottom: 1px solid #000; }
                  .flex { display: flex; justify-content: space-between; gap: 16px; }
                  .company-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
                  .muted { color: #333; font-size: 11px; }
                  .right { text-align: right; }
                  .qr { border: 1px solid #000; padding: 4px; width: 68px; height: 68px; }
                  .address-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #000; }
                  .address-block { padding: 10px 14px; border-right: 1px solid #000; }
                  .address-block:last-child { border-right: none; }
                  .address-title { font-weight: 700; margin-bottom: 6px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #000; padding: 6px; vertical-align: top; }
                  th { background: #f5f5f5; text-align: left; }
                  .table-cell { font-size: 11px; }
                  .text-right { text-align: right; }
                  .text-center { text-align: center; }
                  .item-name { font-weight: 600; }
                  .summary { max-width: 320px; margin-left: auto; }
                  .summary-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 11px; }
                  .summary-row.total { font-weight: 700; border-top: 1px solid #000; padding-top: 6px; margin-top: 6px; }
                  .footer { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11px; }
                  .signature { text-align: right; }
                  .signature-line { border-top: 1px solid #000; margin-top: 32px; padding-top: 4px; }
                  @media print {
                    body { background: #fff; }
                    .toolbar { display: none; }
                    .page { margin: 0; border: none; width: auto; min-height: auto; }
                  }
                </style>
              </head>
              <body>
                <div class="toolbar">
                  <button class="btn" onclick="window.close()">Close</button>
                  <button class="btn primary" onclick="window.print()">Print / Download</button>
                </div>
                <div class="page">
                  <div class="title">TAX INVOICE</div>

                  <div class="section flex">
                    <div>
                      <div class="company-name">OPTIMACONNECT PVT. LTD</div>
                      <div class="muted">Sold By: VMR Solution</div>
                    </div>
                    <div class="right">
                      <img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(qrData)}" alt="Invoice QR" />
                      <div class="muted" style="margin-top: 6px;">${safe(invoice.orderNumber)}</div>
                    </div>
                  </div>

                  <div class="section flex">
                    <div>
                      <div><strong>Order Number:</strong> ${safe(invoice.orderNumber)}</div>
                      <div><strong>Order Date:</strong> ${orderDate || new Date().toLocaleDateString('en-GB')}</div>
                      <div><strong>Payment Method:</strong> ${safe(invoice.paymentMethod) || 'N/A'}</div>
                    </div>
                    <div class="right">
                      <div><strong>Status:</strong> ${safe(invoice.status) || 'N/A'}</div>
                      <div><strong>Invoice Date:</strong> ${orderDate || new Date().toLocaleDateString('en-GB')}</div>
                    </div>
                  </div>

                  <div class="address-grid">
                    <div class="address-block">
                      <div class="address-title">Billed To</div>
                      <div>${safe(invoice.customerName) || 'Customer'}</div>
                      <div class="muted">${addressWithPin}</div>
                      <div class="muted">Email: ${safe(invoice.customerEmail) || 'N/A'}</div>
                      <div class="muted">Phone: ${safe(invoice.customerPhone) || 'N/A'}</div>
                    </div>
                    <div class="address-block">
                      <div class="address-title">Shipped To</div>
                      <div>${safe(invoice.customerName) || 'Customer'}</div>
                      <div class="muted">${addressWithPin}</div>
                      <div class="muted">Phone: ${safe(invoice.customerPhone) || 'N/A'}</div>
                    </div>
                  </div>

                  <div class="section">
                    <table>
                      <thead>
                        <tr>
                          <th class="table-cell">#</th>
                          <th class="table-cell">Item</th>
                          <th class="table-cell text-center">Qty</th>
                          <th class="table-cell text-right">Price</th>
                          <th class="table-cell text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemRows || fallbackRow}
                      </tbody>
                    </table>
                  </div>

                  <div class="section">
                    <div class="summary">
                      <div class="summary-row"><span>Subtotal</span><span>${rupee}${formatCurrency(subtotal)}</span></div>
                      <div class="summary-row"><span>GST</span><span>${rupee}${formatCurrency(gst)}</span></div>
                      <div class="summary-row"><span>Delivery Charges</span><span>${rupee}${formatCurrency(deliveryCharges)}</span></div>
                      <div class="summary-row"><span>Discount</span><span>-${rupee}${formatCurrency(discount)}</span></div>
                      <div class="summary-row total"><span>Grand Total</span><span>${rupee}${formatCurrency(total)}</span></div>
                    </div>
                  </div>

                  <div class="section footer">
                    <div>
                      <div><strong>Returns Policy:</strong> Please return items with original packaging and invoice.</div>
                      <div class="muted">Keep this invoice for warranty and support.</div>
                    </div>
                    <div class="signature">
                      <div><strong>OPTIMACONNECT PVT. LTD</strong></div>
                      <div class="signature-line">Authorized Signatory</div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (error) {
      alert('Failed to generate invoice');
    }
  };

  const handleCancelOrder = () => {
    if (!isHydrated) return;
    setShowCancelModal(true);
  };

  const handleReportIssue = () => {
    if (!isHydrated) return;
    setShowReportModal(true);
  };

  const handleInitiateReturn = () => {
    if (!isHydrated) return;
    alert('Return process initiated. Our team will contact you within 24 hours.');
  };

  if (!isHydrated) {
    return (
      <div className="rounded-lg bg-card p-6 shadow-elevation-2">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
          Order Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth"
            disabled
          >
            <Icon name="DocumentArrowDownIcon" size={18} />
            <span>Download Invoice</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth"
            disabled
          >
            <Icon name="ExclamationTriangleIcon" size={18} />
            <span>Report Issue</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-card p-6 shadow-elevation-2">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
          Order Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
          >
            <Icon name="DocumentArrowDownIcon" size={18} />
            <span>Download Invoice</span>
          </button>

          <button
            onClick={handleReportIssue}
            className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
          >
            <Icon name="ExclamationTriangleIcon" size={18} />
            <span>Report Issue</span>
          </button>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center justify-center space-x-2 rounded-md border border-error bg-background px-4 py-3 text-sm font-medium text-error transition-smooth hover:bg-error hover:text-error-foreground"
            >
              <Icon name="XCircleIcon" size={18} />
              <span>Cancel Order</span>
            </button>
          )}

          {canReturn && (
            <button
              onClick={handleInitiateReturn}
              className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
            >
              <Icon name="ArrowUturnLeftIcon" size={18} />
              <span>Initiate Return</span>
            </button>
          )}
        </div>

        <div className="mt-4 rounded-md bg-muted p-4">
          <div className="flex items-start space-x-3">
            <Icon name="InformationCircleIcon" size={20} className="mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Need Help?</p>
              <p className="caption mt-1 text-muted-foreground">
                Contact our customer support team for any queries or assistance with your order.
              </p>
              <button className="mt-2 text-sm font-medium text-primary transition-smooth hover:underline">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-background/80 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-elevation-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Cancel Order
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-muted-foreground transition-smooth hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            <p className="caption mb-6 text-muted-foreground">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  alert('Order cancelled successfully. Refund will be processed within 5-7 business days.');
                }}
                className="flex-1 rounded-md bg-error px-4 py-2 text-sm font-medium text-error-foreground transition-smooth hover:scale-[0.97]"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-background/80 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-elevation-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Report Issue
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-muted-foreground transition-smooth hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Issue Type
              </label>
              <select className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Delayed Delivery</option>
                <option>Damaged Product</option>
                <option>Wrong Item Received</option>
                <option>Missing Items</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Please describe the issue in detail..."
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  alert('Issue reported successfully. Our team will contact you within 24 hours.');
                }}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderActions;
