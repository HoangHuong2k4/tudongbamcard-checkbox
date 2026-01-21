// Auto Click Card & Checkbox Extension
// Chỉ hoạt động trên trang thanh toán OpenAI

let isProcessing = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Fill input field quickly
function fillInputField(element, text) {
  if (!element) return;

  element.value = text;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

// Use data from config.js

// Update form data based on selected country
function updateFormDataForCountry(formData, countryCode) {
  const countryDefaults = getCountryData(countryCode);

  return {
    ...formData,
    email: formData.email || countryDefaults.email,
    billingName: formData.billingName || countryDefaults.billingName,
    billingAddressLine1: formData.billingAddressLine1 || countryDefaults.billingAddressLine1,
    billingAddressLine2: formData.billingAddressLine2 || countryDefaults.billingAddressLine2,
    billingCity: formData.billingCity || countryDefaults.billingCity,
    billingDependentLocality: formData.billingDependentLocality || countryDefaults.billingDependentLocality,
    billingPostalCode: formData.billingPostalCode || countryDefaults.billingPostalCode,
    billingState: formData.billingState || countryDefaults.billingState
  };
}

// Select option in dropdown by value
function selectDropdownOption(selectElement, value) {
  if (!selectElement) return false;

  const options = selectElement.querySelectorAll('option');
  for (let option of options) {
    if (option.value === value || option.textContent.includes(value)) {
      selectElement.value = option.value;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      selectElement.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
  }
  return false;
}

// Auto fill form data - fill based on selected country
function autoFillFormData(formData, selectedCountry = 'KR') {
  if (!formData) return;

  console.log('🔄 Starting auto-fill process with data:', formData, 'Country:', selectedCountry);

  let filledFields = [];

  try {
    // Fill email first
    if (formData.email) {
      const emailField = document.getElementById('email');
      if (emailField) {
        fillInputField(emailField, formData.email);
        console.log('✅ Filled email:', formData.email);
        filledFields.push('Email');
      }
    }

    // Fill card number with zeros (display only)
    const cardNumberField = document.getElementById('cardNumber');
    if (cardNumberField) {
      fillInputField(cardNumberField, '0000000000000000');
      console.log('✅ Filled card number display: 0000000000000000');
      filledFields.push('Card Number (Display)');
    }

    // Fill card expiry with custom or default values
    const cardExpiryField = document.getElementById('cardExpiry');
    if (cardExpiryField) {
      const expiryMonth = formData.cardExpiryMonth || '02';
      const expiryYear = formData.cardExpiryYear || '29';
      const expiryValue = `${expiryMonth}/${expiryYear}`;
      fillInputField(cardExpiryField, expiryValue);
      console.log('✅ Filled card expiry display:', expiryValue);
      filledFields.push(`Card Expiry (${expiryValue})`);
    }

    // Fill card CVC with custom or default value
    const cardCvcField = document.getElementById('cardCvc');
    if (cardCvcField) {
      const cvcValue = formData.cardCvc || '004';
      fillInputField(cardCvcField, cvcValue);
      console.log('✅ Filled card CVC display:', cvcValue);
      filledFields.push(`Card CVC (${cvcValue})`);
    }

    // Fill billing country - use selected country or default to KR
    const billingCountryField = document.getElementById('billingCountry');
    if (billingCountryField) {
      const countryCode = selectedCountry || 'KR';
      selectDropdownOption(billingCountryField, countryCode);
      console.log('✅ Selected billing country:', countryCode);
      filledFields.push(`Billing Country (${countryCode})`);
    }

    // Get default data for selected country and merge with formData
    const countryDefaults = getCountryData(selectedCountry || 'KR');
    const mergedFormData = updateFormDataForCountry(formData, selectedCountry || 'KR');

    // Fill billing name using merged data
    const billingNameField = document.getElementById('billingName');
    if (billingNameField && mergedFormData.billingName) {
      fillInputField(billingNameField, mergedFormData.billingName);
      console.log('✅ Filled billing name:', mergedFormData.billingName);
      filledFields.push('Billing Name');
    }

    // Fill billing address line 1 using merged data
    const billingAddressLine1Field = document.getElementById('billingAddressLine1');
    if (billingAddressLine1Field && mergedFormData.billingAddressLine1) {
      fillInputField(billingAddressLine1Field, mergedFormData.billingAddressLine1);
      console.log('✅ Filled billing address line 1:', mergedFormData.billingAddressLine1);
      filledFields.push('Billing Address Line 1');
    }

    // Fill billing address line 2 using merged data
    const billingAddressLine2Field = document.getElementById('billingAddressLine2');
    if (billingAddressLine2Field && mergedFormData.billingAddressLine2) {
      fillInputField(billingAddressLine2Field, mergedFormData.billingAddressLine2);
      console.log('✅ Filled billing address line 2:', mergedFormData.billingAddressLine2);
      filledFields.push('Billing Address Line 2');
    }

    // Fill billing dependent locality (district) using merged data
    const billingDependentLocalityField = document.getElementById('billingDependentLocality');
    if (billingDependentLocalityField && mergedFormData.billingDependentLocality) {
      fillInputField(billingDependentLocalityField, mergedFormData.billingDependentLocality);
      console.log('✅ Filled billing dependent locality:', mergedFormData.billingDependentLocality);
      filledFields.push('Billing Dependent Locality');
    }

    // Fill billing city using merged data
    const billingCityField = document.getElementById('billingLocality');
    if (billingCityField && mergedFormData.billingCity) {
      fillInputField(billingCityField, mergedFormData.billingCity);
      console.log('✅ Filled billing city:', mergedFormData.billingCity);
      filledFields.push('Billing City');
    }

    // Fill billing postal code using merged data
    const billingPostalCodeField = document.getElementById('billingPostalCode');
    if (billingPostalCodeField && mergedFormData.billingPostalCode) {
      fillInputField(billingPostalCodeField, mergedFormData.billingPostalCode);
      console.log('✅ Filled billing postal code:', mergedFormData.billingPostalCode);
      filledFields.push('Billing Postal Code');
    }

    // Fill billing state/province using merged data
    const billingStateField = document.getElementById('billingAdministrativeArea');
    if (billingStateField && mergedFormData.billingState) {
      selectDropdownOption(billingStateField, mergedFormData.billingState);
      console.log('✅ Filled billing state:', mergedFormData.billingState);
      filledFields.push('Billing State');
    }

    console.log('🎉 Auto-fill completed! Filled fields:', filledFields.join(', '));
    showNotification(`🎉 Hoàn thành điền dữ liệu: ${filledFields.length} trường`, 'info');

  } catch (error) {
    console.error('❌ Error in autoFillFormData:', error);
    showNotification('❌ Lỗi khi điền dữ liệu: ' + error.message, 'error');
  }
}

function showNotification(message, type = 'info') {
  // Simple notification using console and alert
  console.log(`[${type.toUpperCase()}] ${message}`);
  if (type === 'warning' || type === 'error') {
    alert(message);
  }
}

async function autoClickCardAndCheckbox(autoClickCard = true, autoCheckTerms = true, autoFillData = false, formData = null, selectedCountry = 'KR') {
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

    // Auto fill form data
    if (autoFillData && formData) {
      console.log('🔄 Starting auto-fill after card/checkbox actions');
      await sleep(1000); // Wait for any DOM changes
      await autoFillFormData(formData, selectedCountry);
      actionsPerformed.push('Form data filled');
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
      // Auto features are always enabled, just pass country and formData
      await autoClickCardAndCheckbox(
        true, // autoClickCard
        true, // autoCheckTerms
        true, // autoFillData
        request.formData,
        request.country || 'KR'
      );
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
});

// Auto-run immediately when script loads (no delay)
async function initializeAutoClick() {
  const settings = await chrome.storage.local.get(['country', 'inputOpacity',
    'email', 'cardCvc', 'cardExpiryMonth', 'cardExpiryYear',
    'billingName', 'billingAddressLine1', 'billingAddressLine2',
    'billingCity', 'billingDependentLocality', 'billingPostalCode', 'billingState']);

  // Auto features are always enabled
  const autoClickCard = true;
  const autoCheckTerms = true;
  const autoFillData = true;
  const selectedCountry = settings.country || 'KR'; // Default to KR
  const inputOpacity = settings.inputOpacity || '1'; // Default to fully visible

  // Get country-specific defaults
  const countryDefaults = getCountryData(selectedCountry);

  // Inject custom CSS with opacity setting
  injectCustomCSS(inputOpacity);

  const formData = {
    email: settings.email || countryDefaults.email,
    cardCvc: settings.cardCvc || '004',
    cardExpiryMonth: settings.cardExpiryMonth || '02',
    cardExpiryYear: settings.cardExpiryYear || '29',
    billingName: settings.billingName || countryDefaults.billingName,
    billingAddressLine1: settings.billingAddressLine1 || countryDefaults.billingAddressLine1,
    billingAddressLine2: settings.billingAddressLine2 || countryDefaults.billingAddressLine2,
    billingCity: settings.billingCity || countryDefaults.billingCity,
    billingDependentLocality: settings.billingDependentLocality || countryDefaults.billingDependentLocality,
    billingPostalCode: settings.billingPostalCode || countryDefaults.billingPostalCode,
    billingState: settings.billingState || countryDefaults.billingState
  };


  if (autoClickCard || autoCheckTerms || autoFillData) {
    // Run immediately without waiting for DOM
    setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms, autoFillData, formData, selectedCountry), 500);

    // Also run when DOM is ready (backup)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms, autoFillData, formData, selectedCountry), 1000);
      });
    } else {
      setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms, autoFillData, formData, selectedCountry), 1000);
    }

    // Run again after 3 seconds in case elements load slowly
    setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms, autoFillData, formData, selectedCountry), 3000);
  }
}


// Auto-update billing data when country changes

// Set data attribute for CSS targeting based on settings
function injectCustomCSS(opacity) {
  // Set data attribute on body for CSS targeting
  document.body.setAttribute('data-input-opacity', opacity);
  console.log('✅ Set data-input-opacity to:', opacity);
}

// Listen for settings changes from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateOpacity') {
    injectCustomCSS(request.opacity);
    console.log('✅ Updated opacity to:', request.opacity);
  }
});

// Start immediately
initializeAutoClick();

// Also run when URL changes (for SPA)
let currentUrl = window.location.href;
setInterval(async () => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    if (currentUrl.includes('pay.openai.com/c/pay/')) {
      const settings = await chrome.storage.local.get(['country', 'inputOpacity',
        'email', 'cardCvc', 'cardExpiryMonth', 'cardExpiryYear',
        'billingName', 'billingAddressLine1', 'billingAddressLine2',
        'billingCity', 'billingDependentLocality', 'billingPostalCode', 'billingState']);

      // Auto features are always enabled
      const autoClickCard = true;
      const autoCheckTerms = true;
      const autoFillData = true;
      const selectedCountry = settings.country || 'KR'; // Default to KR
      const inputOpacity = settings.inputOpacity || '1'; // Default to fully visible

      // Get country-specific defaults
      const countryDefaults = getCountryData(selectedCountry);

      // Inject custom CSS with opacity setting
      injectCustomCSS(inputOpacity);

      const formData = {
        email: settings.email || countryDefaults.email,
        cardCvc: settings.cardCvc || '004',
        cardExpiryMonth: settings.cardExpiryMonth || '02',
        cardExpiryYear: settings.cardExpiryYear || '29',
        billingName: settings.billingName || countryDefaults.billingName,
        billingAddressLine1: settings.billingAddressLine1 || countryDefaults.billingAddressLine1,
        billingAddressLine2: settings.billingAddressLine2 || countryDefaults.billingAddressLine2,
        billingCity: settings.billingCity || countryDefaults.billingCity,
        billingDependentLocality: settings.billingDependentLocality || countryDefaults.billingDependentLocality,
        billingPostalCode: settings.billingPostalCode || countryDefaults.billingPostalCode,
        billingState: settings.billingState || countryDefaults.billingState
      };


      if (autoClickCard || autoCheckTerms || autoFillData) {
        // Run immediately on URL change
        setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms, autoFillData, formData, selectedCountry), 500);
        setTimeout(() => autoClickCardAndCheckbox(autoClickCard, autoCheckTerms, autoFillData, formData, selectedCountry), 1500);
      }
    }
  }
}, 1000);