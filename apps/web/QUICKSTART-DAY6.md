# QUICKSTART — Day 6 PWA Testing

**Complete testing guide for PWA & Mobile Experience**

---

## 1. LOCAL SETUP

### Enable HTTPS (Required for Full PWA)

PWA features require HTTPS. Two options:

**Option A: Next.js Experimental HTTPS**
```bash
cd apps/web
npm run dev -- --experimental-https
# Opens at https://localhost:3000
```

**Option B: ngrok (Recommended for Device Testing)**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Expose via ngrok
ngrok http 3000
# Copy HTTPS URL (e.g., https://abc123.ngrok.io)
```

---

## 2. VERIFY MANIFEST & SERVICE WORKER

### Check Manifest
1. Open browser to `https://localhost:3000`
2. Open DevTools → Application tab
3. Select "Manifest" in left sidebar
4. Verify:
   - Name: "UDAASH — AI Job Matching"
   - Theme color: #2563eb (blue)
   - Display: standalone
   - Icons: 192x192, 512x512

### Check Service Worker
1. DevTools → Application → Service Workers
2. Verify:
   - Status: "activated and is running"
   - Source: `/sw.js`
   - Scope: `/`
3. Click "Update" → Should re-register without errors

### Check Caches
1. DevTools → Application → Cache Storage
2. Verify three caches exist:
   - `udaash-v1-static`
   - `udaash-v1-dynamic`
   - `udaash-v1-images`
3. Expand `static` → Should see:
   - `/`
   - `/dashboard`
   - `/kanban`
   - `/offline`
   - `/manifest.json`

---

## 3. TEST INSTALLATION

### Android (Chrome/Edge)

**Prerequisites:**
- Real Android device OR Android emulator
- Chrome 90+ installed
- Access via ngrok HTTPS URL

**Steps:**
1. Open UDAASH in Chrome on Android
2. Wait 3-5 seconds
3. Install prompt appears at bottom
4. Tap "Install"
5. Native "Add to Home screen" dialog appears
6. Confirm → App icon added to launcher

**Verify:**
- Launch from app drawer
- No browser chrome (address bar, tabs)
- Standalone window with UDAASH branding
- Status bar color: #2563eb (blue)

**Troubleshooting:**
- No prompt? Check DevTools → Application → Manifest for errors
- Prompt dismissed? Clear localStorage key `pwa-install-dismissed`
- Still nothing? Manifest criteria: HTTPS, valid manifest, SW registered, not already installed

### iOS (Safari)

**Prerequisites:**
- Real iOS device (simulator doesn't support PWA installation)
- iOS 14+ with Safari
- Access via ngrok HTTPS URL

**Steps:**
1. Open UDAASH in Safari on iOS
2. Wait 5 seconds
3. Instruction banner appears at bottom
4. Read instructions: "Tap Share button → Add to Home Screen"
5. Follow manually:
   - Tap Share button (box with arrow)
   - Scroll to "Add to Home Screen"
   - Name: "UDAASH" (default)
   - Tap "Add"

**Verify:**
- Icon appears on home screen
- Launch → Opens without Safari UI
- Full screen (respects notch safe area)
- Status bar: default style

**iOS Limitations:**
- No programmatic install prompt (Apple restriction)
- Background sync not supported
- Push notifications require app installed

### Desktop (Chrome/Edge)

**Prerequisites:**
- Chrome 90+ or Edge 90+
- Windows/macOS/Linux
- HTTPS (localhost or ngrok)

**Steps:**
1. Open UDAASH in Chrome/Edge
2. Wait 3-5 seconds
3. Install prompt appears at bottom-right
4. Click "Install"
5. Browser shows "Install app?" dialog
6. Click "Install"

**Verify:**
- App window opens (separate from browser)
- Appears in Start Menu (Windows) or Applications (macOS)
- Launch → Opens in app window, not browser tab
- Custom window title bar with UDAASH icon

**Dismiss Test:**
1. Click "Not now" on install prompt
2. Prompt disappears
3. Reload page → Prompt does NOT appear
4. Open localStorage → Check `pwa-install-dismissed` timestamp
5. Wait 7 days OR manually delete key
6. Reload → Prompt reappears after 3s

---

## 4. TEST OFFLINE MODE

### Go Offline

**Chrome DevTools Method:**
1. Open DevTools → Network tab
2. Change "No throttling" to "Offline"
3. Reload page

**Airplane Mode Method:**
1. Enable airplane mode on device
2. Reload page

### Verify Offline Behavior

**Test 1: Cached Pages Load**
1. Go offline
2. Navigate to `/dashboard` → Should load instantly
3. Navigate to `/kanban` → Should load instantly
4. Orange "You're offline" indicator appears at top

**Test 2: Uncached Page Shows Fallback**
1. Go offline
2. Navigate to `/some-random-route` → Offline fallback page appears
3. Verify content:
   - Large offline icon (orange)
   - "You're Offline" heading
   - "Try Again" button
   - "Go to Home" link
   - Tip box: "Changes will sync automatically"

**Test 3: Service Worker Fetch**
1. DevTools → Network tab (keep on "Offline")
2. Navigate between cached pages
3. Network shows: "(ServiceWorker)" next to requests
4. Status: 200 (from cache)

### Go Back Online

**Test 4: Online Indicator**
1. Turn network back on
2. Orange indicator turns blue: "Syncing changes..."
3. After 2 seconds → Green: "Back online • All changes synced"
4. After 2 more seconds → Indicator auto-hides

**Test 5: Fresh Data**
1. Back online
2. Navigate to page
3. Network tab shows: Fetch from network (not cache)
4. Cache updated in background

---

## 5. TEST MOBILE EXPERIENCE

### Safe Area (iOS with Notch)

**Test Devices:** iPhone X, 11, 12, 13, 14, 15 (any with notch)

**Verify:**
1. Open UDAASH on iOS device
2. Check top: Content not obscured by notch
3. Check bottom: Install prompt not covered by home indicator
4. Rotate to landscape: Content respects curved edges

**CSS Classes in Use:**
- `.safe-area-inset` on `<main>`
- `.safe-area-top` on headers
- `.safe-area-bottom` on install prompt

### Touch Targets

**Verify Minimum 44px:**
1. Open UDAASH on mobile
2. Inspect any button (e.g., "Install", "View", "Dismiss")
3. DevTools → Elements → Computed
4. Check: `min-height: 44px`, `min-width: 44px`

**Test Tapping:**
- All buttons easy to tap (no missed taps)
- Proper spacing between adjacent buttons (≥8px)
- No accidental taps on nearby elements

### Dynamic Viewport Height

**Test on Mobile:**
1. Open page with full-height content
2. Scroll down → Browser chrome hides (address bar)
3. Content should not jump or shift
4. Height adjusts smoothly with `100dvh`

**Compare with `100vh`:**
- Old `100vh`: Would overflow when chrome hides
- New `100dvh`: Adjusts to visible viewport

### Native Scrolling

**Verify:**
- No custom scroll hijacking
- Inertia scrolling works (flick → coasts)
- No parallax effects
- No scroll animations (calm, not gimmicky)

---

## 6. TEST HAPTIC FEEDBACK

**Only works on mobile devices with vibration support**

### Test Cases

**Success Haptic (30-50-30ms):**
1. Drag a job card to new column on Kanban
2. Release → Feel triple tap
3. Pattern: Short-Medium-Short

**Confirm Haptic (40ms):**
1. Tap "Install" button on install prompt
2. Feel single tap
3. Pattern: Single medium tap

**Error Haptic (50-100-50-100-50ms):**
1. Trigger a validation error (future feature)
2. Feel double pulse
3. Pattern: Medium-Long-Medium-Long-Medium

**Verify Graceful Fallback:**
1. Test on desktop (no vibration)
2. No console errors
3. Actions still work (haptics silently disabled)

### Enable/Disable (Future)

Users should have control:
```typescript
// In user preferences
const [hapticsEnabled, setHapticsEnabled] = useState(true);

// Before calling hapticPresets.success()
if (hapticsEnabled) {
  hapticPresets.success();
}
```

---

## 7. LIGHTHOUSE AUDIT

### Run Lighthouse

**Chrome DevTools:**
1. Open UDAASH in Chrome
2. DevTools → Lighthouse tab
3. Select categories:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - ✅ Progressive Web App
4. Device: Mobile
5. Click "Generate report"

### Expected Scores

| Category | Target | Notes |
|----------|--------|-------|
| Performance | ≥90 | FCP <1.8s, TTI <3.8s |
| Accessibility | ≥95 | Contrast, ARIA, keyboard |
| Best Practices | ≥90 | HTTPS, no errors |
| SEO | ≥90 | Meta tags, viewport |
| PWA | 100 | All checks pass |

### PWA Checklist (Should All Pass)

✅ Installable
✅ Provides a valid apple-touch-icon
✅ Configured for a custom splash screen
✅ Sets a theme color
✅ Contains content when JavaScript is unavailable
✅ Has a `<meta name="viewport">` tag with width or initial-scale
✅ Registers a service worker
✅ Responds with 200 when offline
✅ Uses HTTPS

### Troubleshooting Failed Audits

**Performance <90:**
- Check bundle size (run `npm run build` → analyze)
- Optimize images (use Next/Image, AVIF/WebP)
- Reduce JavaScript (code split heavy components)

**Accessibility <95:**
- Add alt text to images
- Check color contrast (aim for 4.5:1)
- Verify keyboard navigation (Tab through all elements)

**PWA Fails:**
- Manifest not valid? Check DevTools → Application → Manifest
- SW not registered? Check DevTools → Application → Service Workers
- Offline fails? Test with Network: Offline in DevTools

---

## 8. CROSS-BROWSER TESTING

### Chrome (Desktop + Android)

**Features:**
- ✅ Install prompt
- ✅ Service worker
- ✅ Offline mode
- ✅ Background sync
- ✅ Push notifications

**Test:**
```bash
# Desktop
open -a "Google Chrome" https://localhost:3000

# Android
adb shell am start -a android.intent.action.VIEW -d https://your-ngrok-url.ngrok.io
```

### Safari (Desktop + iOS)

**Features:**
- ❌ Install prompt (manual only)
- ✅ Service worker
- ✅ Offline mode
- ❌ Background sync
- ✅ Push notifications (installed PWA only)

**Test:**
- Desktop: Open in Safari, verify SW registers
- iOS: Install via Share menu, test offline mode

### Firefox (Desktop)

**Features:**
- ❌ Install prompt
- ✅ Service worker
- ✅ Offline mode
- ❌ Background sync
- ✅ Push notifications

**Test:**
- Open in Firefox
- DevTools → Application → Service Workers
- Verify caching works

### Edge (Desktop)

**Features:**
- ✅ Install prompt
- ✅ Service worker
- ✅ Offline mode
- ✅ Background sync
- ✅ Push notifications

**Test:**
- Same as Chrome (Chromium-based)
- Install creates pinned app in Start Menu

---

## 9. COMMON ISSUES

### Issue: Install Prompt Never Appears

**Checklist:**
- [ ] Using HTTPS? (http:// won't work)
- [ ] Manifest valid? (check DevTools → Application)
- [ ] Service worker registered? (check DevTools → Service Workers)
- [ ] Not already installed? (check chrome://apps on desktop)
- [ ] Waited 3-5 seconds? (delay is intentional)
- [ ] Dismissed recently? (check localStorage `pwa-install-dismissed`)

**Fix:**
```javascript
// In browser console
localStorage.removeItem('pwa-install-dismissed');
// Reload page
```

### Issue: Service Worker Not Registering

**Check console for errors:**
- `Failed to register a ServiceWorker` → Check sw.js syntax
- `SecurityError` → Must use HTTPS
- `Syntax error in sw.js` → Check for typos

**Force re-register:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
// Reload page
```

### Issue: Offline Page Not Showing

**Check:**
- [ ] Service worker installed?
- [ ] Cache populated? (DevTools → Application → Cache Storage)
- [ ] Fetch listener working? (check Network tab for "(ServiceWorker)")

**Debug:**
```javascript
// In sw.js, add logging
self.addEventListener('fetch', (event) => {
  console.log('Fetch:', event.request.url);
  // ... rest of handler
});
```

### Issue: Online/Offline Indicator Stuck

**Refresh network status:**
```javascript
// In browser console
window.dispatchEvent(new Event('online'));
// Or
window.dispatchEvent(new Event('offline'));
```

**Check event listeners:**
- DevTools → Console
- Type: `window.ononline`, `window.onoffline`
- Should show listeners attached

### Issue: Safe Area Not Working (iOS)

**Verify viewport meta tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

**Check CSS:**
```css
/* Should have */
padding: env(safe-area-inset-top, 0);
```

**Test in iOS Simulator:**
- Xcode → Simulator → Hardware → Device (choose notched device)

---

## 10. PRODUCTION CHECKLIST

Before deploying to production:

### Pre-Deploy
- [ ] Run `npm run build` successfully
- [ ] Run Lighthouse audit (all scores ≥90, PWA 100)
- [ ] Test install on real Android device
- [ ] Test install on real iOS device
- [ ] Test install on desktop Chrome/Edge
- [ ] Test offline mode on all platforms
- [ ] Verify manifest.json accessible at `/manifest.json`
- [ ] Verify sw.js accessible at `/sw.js`
- [ ] Check all icons exist (192x192, 512x512)
- [ ] Test safe areas on iOS device with notch

### Deploy
- [ ] Deploy to HTTPS domain (required)
- [ ] Verify service worker registers in production
- [ ] Monitor SW registration errors (analytics)
- [ ] Test install on production URL
- [ ] Verify caching working in production

### Post-Deploy
- [ ] Monitor cache hit rate
- [ ] Check for SW update errors
- [ ] Verify install prompts appearing
- [ ] Track install conversions (analytics)
- [ ] Monitor offline usage patterns

### Analytics Events to Track

```typescript
// Install prompt shown
gtag('event', 'pwa_install_prompt_shown', {
  platform: 'android' | 'ios' | 'desktop'
});

// Install completed
gtag('event', 'pwa_install_completed', {
  platform: 'android' | 'ios' | 'desktop'
});

// Offline usage
gtag('event', 'pwa_offline_navigation', {
  page: '/dashboard'
});

// Service worker error
gtag('event', 'pwa_service_worker_error', {
  error: errorMessage
});
```

---

## 11. DEBUGGING TIPS

### View Service Worker Logs

**Chrome DevTools:**
1. Application → Service Workers
2. Click source file link (`sw.js`)
3. Add breakpoints
4. Use `console.log()` in fetch handler

**Live Console:**
```javascript
// In sw.js
self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetch:', event.request.url);
  // ... handler
});
```

### Inspect Caches

**DevTools:**
1. Application → Cache Storage
2. Expand cache name
3. View cached resources
4. Right-click → Delete to test cache miss

**Console:**
```javascript
// List all caches
caches.keys().then(console.log);

// Open specific cache
caches.open('udaash-v1-static').then(cache => {
  cache.keys().then(console.log);
});

// Delete cache
caches.delete('udaash-v1-static');
```

### Test Network Conditions

**Chrome DevTools:**
1. Network tab
2. Throttling dropdown:
   - Fast 3G (4G)
   - Slow 3G
   - Offline
3. Reload page, observe load times

### Simulate Install Prompt (Desktop)

**Chrome DevTools:**
1. Application → Manifest
2. Click "Add to home screen" button (icon with +)
3. Triggers install prompt programmatically

---

## 12. NEXT STEPS

After verifying Day 6 works:

### Immediate
1. Add icon assets (192x192, 512x512 PNG)
2. Test on more devices (Samsung, Pixel, iPhone models)
3. Monitor Lighthouse scores in CI/CD

### Phase 2: Sync Queue
1. Implement IndexedDB for queued changes
2. Add POST /api/jobs/sync endpoint
3. Update service worker sync handler
4. Test offline → online sync flow

### Phase 3: Push Notifications
1. Add user opt-in UI
2. Implement POST /api/push/subscribe
3. Send test push from backend
4. Handle notification clicks in SW

### Phase 4: Advanced Caching
1. Precache user's top AI matches
2. Implement cache eviction (LRU)
3. Background cache refresh
4. Reduce API calls with smart caching

---

**End of Quickstart**

You now have a fully functional PWA. Test thoroughly on real devices before production deploy.
