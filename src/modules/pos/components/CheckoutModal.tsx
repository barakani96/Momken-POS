import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Stack, Button, InlineNotification, Tag } from '@carbon/react';
import { Printer, Wallet, CheckmarkOutline, Receipt, QrCode } from '@carbon/icons-react';
import { CartItem } from '../pages/POS';
import TouchNumericKeypad from './TouchNumericKeypad';
import { useHardware } from '../../../infrastructure/hardware/HardwareContext';
import { useReceiptTemplate } from '../../settings/context/ReceiptTemplateContext';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onRequestClose: () => void;
  onRequestSubmit: () => void;
}

export default function CheckoutModal({
  isOpen,
  cart,
  subtotal,
  tax,
  total,
  onRequestClose,
  onRequestSubmit
}: CheckoutModalProps) {
  const { t } = useTranslation();
  const { printToRole } = useHardware();
  const { activeTemplate, openCustomizationModal, formatReceiptPlainText } = useReceiptTemplate();
  const [receiptNumber, setReceiptNumber] = useState('');
  
  // We use string for keypad input to handle "0" easily, parse to number for logic
  const [cashAmountStr, setCashAmountStr] = useState<string>('0');
  const [cardAmountStr, setCardAmountStr] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState<'Full Cash' | 'Full Card' | 'Split'>('Full Cash');
  const [activeInput, setActiveInput] = useState<'cash' | 'card'>('cash');
  const [printResults, setPrintResults] = useState<{success: boolean; bytes: string; printerName: string}[] | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReceiptNumber(`RCPT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
      setPaymentMethod('Full Cash');
      setCashAmountStr(total.toFixed(2));
      setCardAmountStr('0');
      setActiveInput('cash');
      setPrintResults(null);
    }
  }, [isOpen, total]);

  const cashAmount = parseFloat(cashAmountStr) || 0;
  const cardAmount = parseFloat(cardAmountStr) || 0;
  const totalPaid = cashAmount + cardAmount;
  const balanceDue = Math.max(0, total - totalPaid);
  const change = Math.max(0, totalPaid - total);

  const handleNetworkPrint = async () => {
    const rawContent = formatReceiptPlainText(activeTemplate.branchId, {
      orderNumber: receiptNumber,
      cashierName: 'Barak Ani',
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      subtotal,
      tax,
      total,
      paymentMethod,
      cashAmount,
      cardAmount,
      change,
      date: new Date().toLocaleString()
    });
    const results = await printToRole('Customer', rawContent);
    setPrintResults(results);
    if (results.length === 0) {
      window.print(); // Fallback to browser print if no network printer
    }
  };

  const handleSubmit = async () => {
    // Optionally fire kitchen print on submit
    const kitchenContent = `ORDER: ${receiptNumber}\nItems:\n${cart.map(i => `${i.qty}x ${i.name}`).join('\n')}`;
    await printToRole('Kitchen', kitchenContent);
    
    // Also print customer receipt if auto-print is desired, or just let user click Print
    onRequestSubmit();
  };

  const handleMethodChange = (method: 'Full Cash' | 'Full Card' | 'Split') => {
    setPaymentMethod(method);
    if (method === 'Full Cash') {
      setCashAmountStr(total.toFixed(2));
      setCardAmountStr('0');
      setActiveInput('cash');
    } else if (method === 'Full Card') {
      setCardAmountStr(total.toFixed(2));
      setCashAmountStr('0');
      setActiveInput('card');
    } else {
      setCashAmountStr('0');
      setCardAmountStr('0');
      setActiveInput('cash');
    }
  };

  const handleQuickCash = (amount: number) => {
    setPaymentMethod('Full Cash');
    setCashAmountStr(amount.toFixed(2));
    setCardAmountStr('0');
  };

  const handleKeypadInput = (val: string) => {
    const currentStr = activeInput === 'cash' ? cashAmountStr : cardAmountStr;
    const newStr = currentStr === '0' ? val : currentStr + val;
    if (activeInput === 'cash') setCashAmountStr(newStr);
    else setCardAmountStr(newStr);
  };

  const handleKeypadClear = () => {
    if (activeInput === 'cash') setCashAmountStr('0');
    else setCardAmountStr('0');
  };

  const handleKeypadBackspace = () => {
    const currentStr = activeInput === 'cash' ? cashAmountStr : cardAmountStr;
    const newStr = currentStr.length > 1 ? currentStr.slice(0, -1) : '0';
    if (activeInput === 'cash') setCashAmountStr(newStr);
    else setCardAmountStr(newStr);
  };

  const isValid = totalPaid >= total;

  return (
    <Modal
      open={isOpen}
      modalHeading={t('checkout_summary')}
      primaryButtonText={paymentMethod !== 'Full Card' ? `${t('process_payment')} & Open Drawer` : t('process_payment')}
      secondaryButtonText={t('cancel')}
      onRequestClose={onRequestClose}
      onRequestSubmit={handleSubmit}
      primaryButtonDisabled={!isValid}
    >
      <Stack gap={5}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Payment Methods & Keypad (Left Side) */}
          <div style={{ flex: '1 1 300px', backgroundColor: 'var(--cds-layer-01)', padding: '1.5rem', border: '1px solid var(--cds-border-subtle)' }}>
            <h4 className="heading-03" style={{ marginBottom: '1rem' }}>{t('payment_details')}</h4>
            <Stack gap={4}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button kind={paymentMethod === 'Full Cash' ? 'primary' : 'secondary'} size="sm" onClick={() => handleMethodChange('Full Cash')} style={{ flex: 1 }}>{t('full_cash')}</Button>
                <Button kind={paymentMethod === 'Full Card' ? 'primary' : 'secondary'} size="sm" onClick={() => handleMethodChange('Full Card')} style={{ flex: 1 }}>{t('full_card')}</Button>
                <Button kind={paymentMethod === 'Split' ? 'primary' : 'secondary'} size="sm" onClick={() => handleMethodChange('Split')} style={{ flex: 1 }}>{t('split')}</Button>
              </div>
              
              {paymentMethod === 'Full Cash' && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button kind="ghost" size="sm" onClick={() => handleQuickCash(total)}>{t('exact')} (${total.toFixed(2)})</Button>
                  {[10, 20, 50, 100].map(amt => (
                    <Button key={amt} kind="ghost" size="sm" onClick={() => handleQuickCash(amt)} disabled={amt < total}>${amt}</Button>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div 
                  onClick={() => setActiveInput('cash')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    border: activeInput === 'cash' ? '2px solid var(--cds-focus)' : '1px solid var(--cds-border-subtle)',
                    cursor: 'pointer',
                    backgroundColor: paymentMethod !== 'Split' && paymentMethod !== 'Full Cash' ? 'var(--cds-background)' : 'var(--cds-field-01)'
                  }}
                >
                  <div className="label-01">{t('cash_amount')}</div>
                  <div className="heading-03">${cashAmountStr}</div>
                </div>

                <div 
                  onClick={() => paymentMethod === 'Split' && setActiveInput('card')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    border: activeInput === 'card' ? '2px solid var(--cds-focus)' : '1px solid var(--cds-border-subtle)',
                    cursor: paymentMethod === 'Split' ? 'pointer' : 'not-allowed',
                    backgroundColor: paymentMethod !== 'Split' ? 'var(--cds-background)' : 'var(--cds-field-01)',
                    opacity: paymentMethod !== 'Split' ? 0.5 : 1
                  }}
                >
                  <div className="label-01">{t('card_amount')}</div>
                  <div className="heading-03">${cardAmountStr}</div>
                </div>
              </div>

              {/* Touch Numeric Keypad */}
              <div style={{ marginTop: '1rem' }}>
                 <TouchNumericKeypad 
                    onInput={handleKeypadInput}
                    onClear={handleKeypadClear}
                    onBackspace={handleKeypadBackspace}
                 />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--cds-layer-02)', marginTop: '0.5rem' }}>
                <span className="heading-03">{t('balance_due')}: ${balanceDue.toFixed(2)}</span>
                {change > 0 && <span className="heading-03" style={{ color: 'var(--cds-support-success)' }}>{t('change')}: ${change.toFixed(2)}</span>}
              </div>
            </Stack>
          </div>

          {/* Receipt Preview (Right Side) */}
          <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
              <Button 
                kind="ghost" 
                size="sm" 
                renderIcon={Receipt} 
                iconDescription="Customize Template"
                onClick={() => openCustomizationModal(activeTemplate.branchId)}
              >
                Template
              </Button>
              <Button 
                kind="secondary" 
                size="sm" 
                renderIcon={Printer} 
                iconDescription={t('print_receipt')}
                onClick={handleNetworkPrint}
              >
                {t('print_receipt')}
              </Button>
            </div>

            {printResults && printResults.map((res, i) => (
              <InlineNotification
                key={i}
                kind={res.success ? 'success' : 'error'}
                title={res.printerName}
                subtitle={res.success ? 'Receipt dispatched' : 'Printer offline'}
                hideCloseButton
                style={{ marginBottom: '1rem', maxWidth: '100%' }}
              >
                {res.success && (
                  <pre style={{ fontSize: '10px', marginTop: '0.5rem', background: 'var(--cds-layer-02)', padding: '0.5rem' }}>
                    {res.bytes}
                  </pre>
                )}
              </InlineNotification>
            ))}

            <div 
              id="receipt-print-area" 
              className={printResults ? "receipt-preview-sent" : ""}
              style={{
                fontFamily: `'IBM Plex Mono', monospace`,
                fontSize: '0.8rem',
                lineHeight: 1.4,
                backgroundColor: 'var(--cds-layer-01, #ffffff)',
                color: 'var(--cds-text-primary, #161616)',
                padding: '1rem',
                border: '1px solid var(--cds-border-subtle)',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                maxHeight: '520px',
                overflowY: 'auto',
              }}
            >
              {/* Store Logo */}
              {activeTemplate.elements.showLogo && (
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {activeTemplate.elements.logoText || activeTemplate.storeDisplayName}
                  </div>
                  <div style={{ borderBottom: '1px solid #161616', width: '70%', margin: '0.25rem auto' }} />
                </div>
              )}

              {/* Store Name & Contact */}
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>{activeTemplate.storeDisplayName}</div>
                {activeTemplate.elements.showBranchAddress && activeTemplate.address && (
                  <div style={{ fontSize: '0.7rem', color: '#525252' }}>{activeTemplate.address}</div>
                )}
                {activeTemplate.elements.showBranchAddress && activeTemplate.phone && (
                  <div style={{ fontSize: '0.7rem', color: '#525252' }}>Tel: {activeTemplate.phone}</div>
                )}
                {activeTemplate.elements.showTaxNumber && activeTemplate.elements.taxNumber && (
                  <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '0.2rem' }}>
                    {activeTemplate.elements.taxNumber}
                  </div>
                )}
              </div>

              {/* Branch Store-specific Header */}
              {activeTemplate.headerText && (
                <div style={{
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  fontSize: '0.7rem',
                  padding: '0.25rem 0',
                  borderTop: '1px dashed #8d8d8d',
                  borderBottom: '1px dashed #8d8d8d',
                  marginBottom: '0.5rem',
                  color: '#393939'
                }}>
                  {activeTemplate.headerText}
                </div>
              )}

              {/* Metadata */}
              <div style={{ fontSize: '0.7rem', marginBottom: '0.5rem', color: '#525252' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{new Date().toLocaleDateString()}</span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {activeTemplate.elements.showCashierInfo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cashier: Barak Ani</span>
                    <span>Branch: {activeTemplate.branchName}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#161616' }}>
                  <span>{t('transaction')}:</span>
                  <span>{receiptNumber}</span>
                </div>
              </div>
              
              {/* Cart Items */}
              <div style={{ borderTop: '1px dashed #161616', paddingTop: 'var(--cds-spacing-03)', marginBottom: 'var(--cds-spacing-03)' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--cds-spacing-02)' }}>
                    <span style={{ maxWidth: '70%' }}>{item.qty}x {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              {/* Subtotal & Total */}
              <div style={{ borderTop: '1px dashed #161616', paddingTop: 'var(--cds-spacing-03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--cds-spacing-02)' }}>
                  <span>{t('subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--cds-spacing-02)' }}>
                  <span>{t('tax')}</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--cds-spacing-03)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  <span>{t('total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                {/* Payment Breakdown */}
                <div style={{ borderTop: '1px dashed #8d8d8d', marginTop: 'var(--cds-spacing-03)', paddingTop: 'var(--cds-spacing-03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--cds-spacing-02)' }}>
                    <span>{t('cash_amount')}</span>
                    <span>${cashAmount.toFixed(2)}</span>
                  </div>
                  {cardAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--cds-spacing-02)' }}>
                      <span>{t('card_amount')}</span>
                      <span>${cardAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {change > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--cds-spacing-02)', fontWeight: 'bold' }}>
                      <span>{t('change')}</span>
                      <span>${change.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Return Policy */}
                {activeTemplate.elements.showReturnPolicy && activeTemplate.elements.returnPolicyText && (
                  <div style={{
                    borderTop: '1px dashed #8d8d8d',
                    paddingTop: '0.4rem',
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    marginTop: '0.5rem',
                    color: '#525252'
                  }}>
                    {activeTemplate.elements.returnPolicyText}
                  </div>
                )}

                {/* Social Media Handles */}
                {activeTemplate.elements.showSocialMedia && (
                  <div style={{
                    borderTop: '1px dashed #8d8d8d',
                    paddingTop: '0.4rem',
                    fontSize: '0.68rem',
                    textAlign: 'center',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.15rem' }}>Connect With Us</div>
                    {activeTemplate.elements.socialInstagram && <div>IG: {activeTemplate.elements.socialInstagram}</div>}
                    {activeTemplate.elements.socialTwitter && <div>X: {activeTemplate.elements.socialTwitter}</div>}
                    {activeTemplate.elements.socialWebsite && <div>Web: {activeTemplate.elements.socialWebsite}</div>}
                  </div>
                )}

                {/* Barcode or QR Code */}
                {activeTemplate.elements.showBarcode && (
                  <div style={{ textAlign: 'center', margin: '0.5rem 0', borderTop: '1px dashed #8d8d8d', paddingTop: '0.4rem' }}>
                    {activeTemplate.elements.barcodeType === 'QR' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                        <QrCode size={40} />
                        <span style={{ fontSize: '0.6rem' }}>E-INVOICE QR CODE</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 'bold' }}>
                          ||| | |||| || ||| | | ||
                        </div>
                        <div style={{ fontSize: '0.65rem' }}>{receiptNumber}</div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Branch Store-specific Footer */}
                {activeTemplate.footerText ? (
                  <div style={{
                    borderTop: '1px dashed #8d8d8d',
                    paddingTop: '0.5rem',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    fontSize: '0.68rem',
                    marginTop: '0.5rem',
                    color: '#393939'
                  }}>
                    {activeTemplate.footerText}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.7 }}>
                    <p className="body-01">{t('thank_you')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Stack>
    </Modal>
  );
}
