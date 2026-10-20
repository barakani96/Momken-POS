export interface ReceiptPrintElements {
  showLogo: boolean;
  logoText: string;
  showSocialMedia: boolean;
  socialInstagram: string;
  socialTwitter: string;
  socialWebsite: string;
  showReturnPolicy: boolean;
  returnPolicyText: string;
  showBarcode: boolean;
  barcodeType: 'CODE128' | 'QR';
  showTaxNumber: boolean;
  taxNumber: string;
  showCashierInfo: boolean;
  showBranchAddress: boolean;
}

export interface BranchReceiptConfig {
  branchId: string;
  branchName: string;
  storeDisplayName: string;
  phone: string;
  address: string;
  headerText: string;
  footerText: string;
  elements: ReceiptPrintElements;
}

export const DEFAULT_BRANCH_CONFIGS: Record<string, BranchReceiptConfig> = {
  'BR-001': {
    branchId: 'BR-001',
    branchName: 'Riyadh Flagship',
    storeDisplayName: 'APEX RETAIL - RIYADH FLAGSHIP',
    phone: '+966 11 456 7890',
    address: 'Kingdom Center Tower, Level 2, Olaya St, Riyadh',
    headerText: 'WELCOME TO APEX FLAGSHIP STORE\nOpen Daily: 9:00 AM - 11:30 PM\nOfficial Retail Partner - Branch #101',
    footerText: 'Thank you for shopping at Apex Riyadh!\nFree Wi-Fi: Apex-Guest | Pass: Welcome2026\nSurvey: feedback.apex-pos.com\n*** CUSTOMER COPY ***',
    elements: {
      showLogo: true,
      logoText: '★ APEX ENTERPRISE RETAIL ★',
      showSocialMedia: true,
      socialInstagram: '@apex_riyadh',
      socialTwitter: '@apex_pos',
      socialWebsite: 'www.apex-retail.sa',
      showReturnPolicy: true,
      returnPolicyText: 'Return & Exchange Policy:\nItems may be exchanged or returned within 14 days of purchase with original receipt. Merchandise must be unworn, undamaged, with original tags intact.',
      showBarcode: true,
      barcodeType: 'CODE128',
      showTaxNumber: true,
      taxNumber: 'VAT #310123456700003',
      showCashierInfo: true,
      showBranchAddress: true,
    }
  },
  'BR-002': {
    branchId: 'BR-002',
    branchName: 'Jeddah Mall of Arabia',
    storeDisplayName: 'APEX RETAIL - JEDDAH MALL OF ARABIA',
    phone: '+966 12 654 3210',
    address: 'Mall of Arabia, Gate 4, Madinah Rd, Jeddah',
    headerText: 'WELCOME TO APEX JEDDAH MALL OF ARABIA\nBeachside Style & Living\nOfficial Retail Partner - Branch #102',
    footerText: 'Thank you for visiting Jeddah Mall of Arabia!\nPresent this receipt for 2 hours free parking validation at Gate 4.\nVisit us online at www.apex-retail.sa',
    elements: {
      showLogo: true,
      logoText: '★ APEX ENTERPRISE RETAIL ★',
      showSocialMedia: true,
      socialInstagram: '@apex_jeddah',
      socialTwitter: '@apex_pos',
      socialWebsite: 'www.apex-retail.sa',
      showReturnPolicy: true,
      returnPolicyText: 'Return & Exchange Policy:\nExchanges accepted within 14 days with original receipt. Jewelry and promotional items are final sale.',
      showBarcode: true,
      barcodeType: 'CODE128',
      showTaxNumber: true,
      taxNumber: 'VAT #310123456700003',
      showCashierInfo: true,
      showBranchAddress: true,
    }
  },
  'BR-003': {
    branchId: 'BR-003',
    branchName: 'Khobar Corniche',
    storeDisplayName: 'APEX RETAIL - KHOBAR CORNICHE',
    phone: '+966 13 890 1234',
    address: 'Corniche Boulevard, Suite 104, Al Khobar',
    headerText: 'WELCOME TO APEX KHOBAR CORNICHE\nEastern Province Prime Boutique\nOfficial Retail Partner - Branch #103',
    footerText: 'Thank you for shopping by the Corniche!\nWi-Fi: Apex-Khobar (no password)\nInquire about our VIP Gold Loyalty Tier on your next visit.',
    elements: {
      showLogo: true,
      logoText: '★ APEX ENTERPRISE RETAIL ★',
      showSocialMedia: true,
      socialInstagram: '@apex_eastern',
      socialTwitter: '@apex_pos',
      socialWebsite: 'www.apex-retail.sa',
      showReturnPolicy: true,
      returnPolicyText: 'Return Policy:\nFull refunds to original payment method within 7 days; store credit or exchange within 14 days.',
      showBarcode: true,
      barcodeType: 'QR',
      showTaxNumber: true,
      taxNumber: 'VAT #310123456700003',
      showCashierInfo: true,
      showBranchAddress: true,
    }
  },
  'BR-004': {
    branchId: 'BR-004',
    branchName: 'Dubai Mall',
    storeDisplayName: 'APEX RETAIL - DUBAI MALL',
    phone: '+971 4 330 8000',
    address: 'Fashion Avenue, Ground Floor, The Dubai Mall, UAE',
    headerText: 'WELCOME TO APEX DUBAI MALL\nFashion Avenue Flagship\nTRN #100234567800003',
    footerText: 'Thank you for shopping at The Dubai Mall!\nTourist Tax Free (Planet Refund) digital validation available at customer desk.\nConnect with us @apex_dubai',
    elements: {
      showLogo: true,
      logoText: '★ APEX LUXURY RETAIL ★',
      showSocialMedia: true,
      socialInstagram: '@apex_dubai',
      socialTwitter: '@apex_pos',
      socialWebsite: 'www.apex-retail.ae',
      showReturnPolicy: true,
      returnPolicyText: 'Return & Exchange Policy:\nItems in saleable condition with original tags accepted for exchange or credit note within 14 days. Planet Tax Free validation must be presented at airport.',
      showBarcode: true,
      barcodeType: 'CODE128',
      showTaxNumber: true,
      taxNumber: 'TRN #100234567800003',
      showCashierInfo: true,
      showBranchAddress: true,
    }
  },
};
