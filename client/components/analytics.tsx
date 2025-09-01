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

    // Initialize Google Analytics with production-friendly pattern
    if (gaId && !document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
      // Step 1: Initialize dataLayer FIRST (this is critical for Google's detection)
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      // Step 2: Add the js timestamp immediately
      window.gtag('js', new Date());
      
      // Step 3: Add the script tag with exact Google recommended format
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      
      // Step 4: Configure tracking immediately after script loads
      gaScript.onload = () => {
        window.gtag('config', gaId, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true
        });
        console.log('Google Analytics configured successfully for production');
      };
      
      // Insert at the very top of head for maximum priority
      const firstScript = document.head.querySelector('script');
      if (firstScript) {
        document.head.insertBefore(gaScript, firstScript);
      } else {
        document.head.appendChild(gaScript);
      }
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