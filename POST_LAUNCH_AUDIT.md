# Post-Launch Audit Checklist

This document tracks items that need to be reviewed, tested, and potentially fixed after taking the site live.

**Status Legend:**
- ⏳ **TODO** - Not started
- 🔄 **IN PROGRESS** - Currently working on
- ✅ **DONE** - Completed and verified
- ⚠️ **URGENT** - High priority, impacts core functionality

---

## Critical Infrastructure

### Stripe Payment Processing
- [ ] ⚠️ **Add missing webhook event handlers**
  - Current: Only `checkout.session.completed` is handled
  - Need to add:
    - [ ] `customer.subscription.updated` - Handle plan changes, upgrades, downgrades
    - [ ] `customer.subscription.deleted` - Handle cancellations, update DB status
    - [ ] `invoice.payment_succeeded` - Track successful recurring payments
    - [ ] `invoice.payment_failed` - Notify customers of failed payments, handle retry logic
  - Location: `server/routes.ts:1787`

- [ ] Test all subscription flows end-to-end with real payment
  - [ ] New subscription creation
  - [ ] Recurring payment processing
  - [ ] Subscription cancellation
  - [ ] Plan changes/upgrades
  - [ ] Failed payment handling

- [ ] Verify webhook is receiving events in production
  - Check Stripe Dashboard → Webhooks → Logs
  - Confirm all 5 events are being sent successfully

### Database & Data Integrity
- [ ] Audit all database tables for orphaned records
  - [ ] Customers without subscriptions
  - [ ] Subscriptions without customers
  - [ ] Stripe IDs that don't match live mode

- [ ] Verify all indexes are in place for performance
  - [ ] Customer lookups by Supabase ID
  - [ ] Subscription lookups by customer ID
  - [ ] Stripe customer ID lookups

### Authentication & Security
- [ ] Test authentication flows
  - [ ] Sign up
  - [ ] Sign in
  - [ ] Password reset
  - [ ] Email verification

- [ ] Verify all environment variables are set correctly in Railway
  - [ ] Stripe keys (live mode)
  - [ ] Supabase keys
  - [ ] JWT secrets
  - [ ] Email service keys
  - [ ] `RAILWAY_PUBLIC_DOMAIN=dookscoopem.com`

- [ ] Review API endpoints for proper authentication
  - [ ] Admin-only routes require admin role
  - [ ] Customer routes require authentication
  - [ ] Public routes are appropriately public

---

## User Experience

### Onboarding Flow
- [ ] Test complete onboarding flow as new customer
  - [ ] Form validation works correctly
  - [ ] All required fields are enforced
  - [ ] Address validation (if applicable)
  - [ ] Dog information collection

- [ ] Verify checkout process
  - [ ] Correct prices displayed
  - [ ] Extra dog charges calculate correctly
  - [ ] Stripe checkout shows correct amounts
  - [ ] Redirect to dashboard after success
  - [ ] Handle cancelled checkout gracefully

### Customer Dashboard
- [ ] Verify customer can view their subscription
  - [ ] Correct plan displayed
  - [ ] Correct price shown
  - [ ] Next billing date accurate
  - [ ] Number of dogs shown correctly

- [ ] Test subscription management features
  - [ ] Can customer cancel subscription?
  - [ ] Can customer update payment method?
  - [ ] Can customer change plan?
  - [ ] Can customer update dog count?

### Email Notifications
- [ ] Verify all email notifications are working
  - [ ] Welcome email after signup
  - [ ] Payment confirmation emails
  - [ ] Failed payment notifications
  - [ ] Subscription cancellation confirmation
  - [ ] Service reminders (if applicable)

- [ ] Check email content and links
  - [ ] Links point to `dookscoopem.com` (not Railway URL)
  - [ ] Branding is correct
  - [ ] No test mode references
  - [ ] No placeholder text

---

## Admin & CRM

### Admin Dashboard
- [ ] Test admin capabilities
  - [ ] View all customers
  - [ ] View all subscriptions
  - [ ] Search/filter functionality
  - [ ] Export data (if applicable)

- [ ] Verify admin can manage customers
  - [ ] View customer details
  - [ ] Update customer information
  - [ ] Cancel subscriptions
  - [ ] Issue refunds (if implemented)

### Content Management
- [ ] Review all CMS content
  - [ ] Homepage content is current
  - [ ] Service descriptions accurate
  - [ ] Pricing matches Stripe products
  - [ ] Media assets loading correctly
  - [ ] No test/placeholder content

---

## Performance & Monitoring

### Site Performance
- [ ] Test page load times
  - [ ] Homepage < 3 seconds
  - [ ] Dashboard < 2 seconds
  - [ ] Checkout flow smooth

- [ ] Check for console errors
  - [ ] No JavaScript errors in browser
  - [ ] No 404s for assets
  - [ ] No CORS issues

### Error Handling
- [ ] Test error scenarios
  - [ ] Invalid form submissions
  - [ ] Network errors
  - [ ] Failed API calls
  - [ ] Stripe errors (card declined, etc.)

- [ ] Verify error messages are user-friendly
  - [ ] No technical jargon
  - [ ] Clear next steps provided
  - [ ] No stack traces visible to users

### Logging & Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure Railway logging
- [ ] Set up uptime monitoring (UptimeRobot, etc.)
- [ ] Create alerts for critical errors

---

## SEO & Marketing

### SEO Basics
- [ ] Verify meta tags on all pages
  - [ ] Title tags
  - [ ] Meta descriptions
  - [ ] Open Graph tags for social sharing
  - [ ] Favicon

- [ ] Check Google Analytics setup
  - [ ] Tracking code on all pages
  - [ ] Goals configured
  - [ ] E-commerce tracking (if applicable)

- [ ] Facebook Pixel verification
  - [ ] Pixel firing correctly
  - [ ] Custom events tracked

### Social Media
- [ ] Test social media preview
  - [ ] Facebook share preview
  - [ ] Twitter/X card preview
  - [ ] LinkedIn preview

- [ ] Verify social media links
  - [ ] Links in footer work
  - [ ] Profile links are correct

---

## Legal & Compliance

### Required Pages
- [ ] Privacy Policy
  - [ ] Updated for live site
  - [ ] Stripe/payment info included
  - [ ] Supabase/data storage mentioned

- [ ] Terms of Service
  - [ ] Service terms clear
  - [ ] Cancellation policy stated
  - [ ] Refund policy (if applicable)

- [ ] Contact Information
  - [ ] Email working
  - [ ] Phone number (if provided)
  - [ ] Physical address (if required)

### Data Protection
- [ ] GDPR compliance (if applicable)
  - [ ] Cookie consent banner
  - [ ] Data deletion requests handling
  - [ ] Privacy policy compliance

- [ ] PCI compliance
  - [ ] Using Stripe (PCI compliant by default)
  - [ ] Not storing card data directly
  - [ ] Secure checkout flow

---

## Mobile & Cross-Browser Testing

### Mobile Responsiveness
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] Verify checkout works on mobile
- [ ] Check email rendering on mobile

### Browser Compatibility
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox
- [ ] Edge
- [ ] Mobile browsers

---

## Backup & Recovery

### Data Backups
- [ ] Verify Supabase automatic backups are enabled
- [ ] Test database restore process
- [ ] Document backup schedule
- [ ] Create manual backup before major changes

### Disaster Recovery Plan
- [ ] Document rollback procedure
- [ ] Keep test environment keys accessible
- [ ] Document Railway rollback process
- [ ] Have emergency contact list

---

## Future Enhancements (Deprioritized)

### Stripe Webhook Handlers - Additional Events
- [ ] `customer.subscription.paused`
- [ ] `customer.subscription.resumed`
- [ ] `invoice.payment_action_required`
- [ ] `customer.updated`
- [ ] `charge.refunded`
- [ ] `charge.dispute.created`

### Feature Requests
- [ ] Customer portal for self-service
- [ ] Referral program
- [ ] Seasonal promotions
- [ ] SMS notifications option
- [ ] Mobile app

---

## Completion Tracking

**Started:** _______________

**Target Completion:** _______________

**Completed:** _______________

**Issues Found:** _______________

**Critical Issues:** _______________

---

## Notes & Issues

Use this section to track specific issues found during the audit:

### Issue Template:
```
**Issue #:**
**Priority:** (Critical/High/Medium/Low)
**Description:**
**Location:**
**Steps to Reproduce:**
**Status:**
**Resolution:**
```

---

**Last Updated:** January 8, 2026
