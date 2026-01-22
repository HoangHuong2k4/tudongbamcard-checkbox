// Background script for Auto Click Card & Checkbox Extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle element selection from element-picker
  if (request.action === "elementSelected") {
    // Store selector immediately
    chrome.storage.local.set({ clickSelector: request.selector }, () => {
      sendResponse({ success: true, saved: true });
    });

    // Broadcast to all extension pages (including settings page)
    chrome.runtime
      .sendMessage({
        action: "elementSelected",
        selector: request.selector,
      })
      .catch(() => {
        // Settings page might not be open, that's ok
        });

    return true; // IMPORTANT: Keep message channel open for async response
  }

  if (request.action === "log") {
    sendResponse({ success: true });
  }

  return true; // Keep message channel open
});

chrome.runtime.onInstalled.addListener(() => {
  });
