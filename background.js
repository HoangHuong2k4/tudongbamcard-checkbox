// Background script for Auto Click Card & Checkbox Extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'log') {
    console.log('[Auto Click]', request.message);
    sendResponse({ success: true });
  }
});



chrome.runtime.onInstalled.addListener(() => {
  console.log('Auto Click Card & Checkbox extension installed');
});