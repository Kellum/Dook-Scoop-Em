import { useEffect } from 'react';

// Type declarations for analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: any;
    _fbq: any;
  }
}

export default function Analytics() {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    const fbPixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

    // Initialize Google Analytics using the global function (set up in HTML)
    if (gaId && typeof window.initGoogleAnalytics === 'function') {
      window.initGoogleAnalytics(gaId);
    }

    // Initialize Facebook Pixel (keep existing working implementation)
    if (fbPixelId && !window.fbq) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
      console.log('Facebook Pixel initialized successfully');
    }
  }, []);

  return null; // This component doesn't render anything
}