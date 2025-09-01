// Simple analytics functions for hardcoded tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: any;
  }
}

// Track page views
export const trackPageView = (url?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-C9GESDP6BV', {
      page_path: url || window.location.pathname
    });
  }

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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

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
      send_to: 'G-C9GESDP6BV',
      event_name: eventName,
      ...data
    });
  }

  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};