chrome.runtime.onInstalled.addListener(() => {
  console.log('Auto Click Card & Checkbox extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'log') {
    console.log('[Auto Click]', request.message);
  }
});