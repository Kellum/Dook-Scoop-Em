// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  console.log('Initializing Google Analytics with ID:', measurementId);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Add timestamp
  window.gtag('js', new Date());
  
  // Configure Google Analytics
  window.gtag('config', measurementId, {
    send_page_view: false // We'll handle page views manually
  });

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script1.onload = () => {
    console.log('Google Analytics script loaded successfully');
    // Send initial page view
    window.gtag('config', measurementId, {
      page_path: window.location.pathname
    });
  };
  document.head.appendChild(script1);
};

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

  if (!pixelId) {
    console.warn('Missing required Facebook Pixel ID: VITE_FACEBOOK_PIXEL_ID');
    return;
  }

  // Add Facebook Pixel script
  const script = document.createElement('script');
  script.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // Add noscript fallback
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
  document.head.appendChild(noscript);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      window.gtag('config', measurementId, {
        page_path: url
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
    // Map common actions to Facebook events
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
        // For other events, use a custom event
        window.fbq('trackCustom', action, {
          category: category,
          label: label,
          value: value
        });
        break;
    }
  }
};

// Track conversions (for important business actions)
export const trackConversion = (eventName: string, data?: any) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: import.meta.env.VITE_GA_MEASUREMENT_ID,
      event_name: eventName,
      ...data
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};