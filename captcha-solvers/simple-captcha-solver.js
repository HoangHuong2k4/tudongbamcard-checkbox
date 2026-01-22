// Simple Captcha Solver - Auto-click captcha checkboxes
(function () {
  // Try to click captcha checkbox
  function clickCaptchaCheckbox() {
    // reCAPTCHA v2
    const recaptchaCheckbox = document.querySelector(
      ".recaptcha-checkbox-border",
    );
    if (
      recaptchaCheckbox &&
      !recaptchaCheckbox.classList.contains("recaptcha-checkbox-checked")
    ) {
      recaptchaCheckbox.click();
      return true;
    }

    // hCaptcha
    const hcaptchaCheckbox = document.querySelector(".hcaptcha-checkbox");
    if (hcaptchaCheckbox) {
      hcaptchaCheckbox.click();
      return true;
    }

    // Cloudflare Turnstile
    const turnstileCheckbox = document.querySelector(".cf-turnstile");
    if (turnstileCheckbox) {
      turnstileCheckbox.click();
      return true;
    }

    return false;
  }

  // Auto-click every 2 seconds
  setInterval(() => {
    clickCaptchaCheckbox();
  }, 2000);

  // Also try on page load
  setTimeout(() => {
    clickCaptchaCheckbox();
  }, 1000);
})();
