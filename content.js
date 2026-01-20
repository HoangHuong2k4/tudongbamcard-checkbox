// Auto Click Card & Checkbox Extension
// Chỉ hoạt động trên trang thanh toán OpenAI

let isProcessing = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showNotification(message, type = 'info') {
  // Simple notification using console and alert
  console.log(`[${type.toUpperCase()}] ${message}`);
  if (type === 'warning' || type === 'error') {
    alert(message);
  }
}

async function autoClickCardAndCheckbox(autoClickCard = true, autoCheckTerms = true) {
  // Only run on OpenAI ChatGPT payment page
  const currentUrl = window.location.href;
  const isOpenAIPayment = currentUrl.includes('pay.openai.com/c/pay/');

  if (!isOpenAIPayment) {
    console.log('ℹ️ [Auto Click] Not on OpenAI payment page, skipping');
    return;
  }

  if (isProcessing) return;
  isProcessing = true;

  try {
    let actionsPerformed = [];

    if (autoClickCard) {
      // Auto-click card button to expand card form (only if not already expanded)
      const cardButton = document.querySelector('[data-testid="card-accordion-item-button"]');
      const cardForm = document.querySelector('.PaymentMethodFormAccordionItem--selected');
      if (cardButton && !cardForm) {
        console.log('🔄 Auto-clicking card button to expand form');
        cardButton.click();
        await sleep(1500); // Wait for form to expand
        actionsPerformed.push('Card form opened');
      } else if (cardForm) {
        console.log('ℹ️ Card form already expanded');
      }
    }

    if (autoCheckTerms) {
      // Auto-check terms of service checkbox
      const termsCheckbox = document.querySelector('#termsOfServiceConsentCheckbox');
      console.log('🔍 Terms checkbox found:', !!termsCheckbox, 'checked:', termsCheckbox?.checked);

      if (termsCheckbox) {
        // Try multiple methods to check the checkbox
        if (!termsCheckbox.checked) {
          console.log('🔄 Auto-checking terms of service checkbox');

          // Method 1: Direct click
          termsCheckbox.click();
          await sleep(200);

          // Method 2: Set checked and dispatch events
          if (!termsCheckbox.checked) {
            termsCheckbox.checked = true;
            termsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            termsCheckbox.dispatchEvent(new Event('input', { bubbles: true }));
            termsCheckbox.dispatchEvent(new Event('click', { bubbles: true }));
          }

          console.log('✅ Terms checkbox checked, final state:', termsCheckbox.checked);

          // Double-check after a moment
          await sleep(500);
          console.log('🔄 Terms checkbox re-check after 500ms:', termsCheckbox.checked);

          await sleep(300);
          actionsPerformed.push('Terms checkbox checked');
        } else {
          console.log('ℹ️ Terms checkbox already checked');
        }
      } else {
        console.log('❌ Terms checkbox not found - trying fallback selectors');

        // Try fallback selectors
        const fallbackSelectors = [
          'input[name="termsOfServiceConsentCheckbox"]',
          'input[type="checkbox"][name*="terms"]',
          'input[type="checkbox"][id*="terms"]',
          '.Checkbox-Input[name="termsOfServiceConsentCheckbox"]'
        ];

        for (const selector of fallbackSelectors) {
          const fallbackCheckbox = document.querySelector(selector);
          if (fallbackCheckbox && !fallbackCheckbox.checked) {
            console.log('🔄 Found checkbox with fallback selector:', selector);
            fallbackCheckbox.click();
            await sleep(200);
            console.log('✅ Fallback checkbox clicked, state:', fallbackCheckbox.checked);
            actionsPerformed.push('Terms checkbox checked (fallback)');
            break;
          }
        }
      }
    }

    if (actionsPerformed.length > 0) {
      showNotification(`🎉 Hoàn thành: ${actionsPerformed.join(', ')}`, 'info');
    } else {
      showNotification('ℹ️ Không có hành động nào được thực hiện', 'info');
    }

  } catch (error) {
    console.error('❌ Error in autoClickCardAndCheckbox:', error);
    showNotification('❌ Lỗi: ' + error.message, 'error');
  } finally {
    isProcessing = false;
  }
}

// Listen for messages from popup/settings
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'manualTrigger') {
    try {
      await autoClickCardAndCheckbox(request.autoClickCard, request.autoCheckTerms);
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
});

// Auto-run immediately when script loads (no delay)
async function initializeAutoClick() {
  const settings = await chrome.storage.local.get(['autoClickCard', 'autoCheckTerms']);
  const autoClickCard = settings.autoClickCard !== false; // Default true
  const autoCheckTerms = settings.autoCheckTerms !== false; // Default true

  if (autoClickCard || autoCheckTerms) {
    // Run immediately without waiting for DOM
    setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms), 500);

    // Also run when DOM is ready (backup)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms), 1000);
      });
    } else {
      setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms), 1000);
    }

    // Run again after 3 seconds in case elements load slowly
    setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms), 3000);
  }
}

// Start immediately
initializeAutoClick();

// Also run when URL changes (for SPA)
let currentUrl = window.location.href;
setInterval(async () => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    if (currentUrl.includes('pay.openai.com/c/pay/')) {
      const settings = await chrome.storage.local.get(['autoClickCard', 'autoCheckTerms']);
      const autoClickCard = settings.autoClickCard !== false;
      const autoCheckTerms = settings.autoCheckTerms !== false;

      if (autoClickCard || autoCheckTerms) {
        // Run immediately on URL change
        setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms), 500);
        setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms), 1500);
      }
    }
  }
}, 1000);