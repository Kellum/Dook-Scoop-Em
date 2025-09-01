// Simplified analytics implementation for reliable production deployment

// Type declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: any;
    _fbq: any;
    initGoogleAnalytics: (measurementId: string) => void;
    ga_initialized: boolean;
  }
}

// Track page views
export const trackPageView = (url?: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      window.gtag('config', measurementId, {
        page_path: url || window.location.pathname
      });
    }
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Facebook Pixel - map common events
  if (typeof window !== 'undefined' && window.fbq) {
    switch (action.toLowerCase()) {
      case 'sign_up':
      case 'signup':
        window.fbq('track', 'CompleteRegistration');
        break;
      case 'contact':
      case 'contact_form':
        window.fbq('track', 'Contact');
        break;
      case 'lead':
      case 'generate_lead':
        window.fbq('track', 'Lead');
        break;
      default:
        window.fbq('trackCustom', action, {
          category: category,
          label: label,
          value: value
        });
        break;
    }
  }
};

// Track conversions
export const trackConversion = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: import.meta.env.VITE_GA_MEASUREMENT_ID,
      event_name: eventName,
      ...data
    });
  }

  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};