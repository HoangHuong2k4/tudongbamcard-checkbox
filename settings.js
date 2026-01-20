// Settings for Auto Click Card & Checkbox Extension

document.addEventListener('DOMContentLoaded', function() {
    const autoClickCardCheckbox = document.getElementById('autoClickCard');
    const autoCheckTermsCheckbox = document.getElementById('autoCheckTerms');
    const manualTriggerButton = document.getElementById('manualTrigger');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.local.get(['autoClickCard', 'autoCheckTerms'], function(result) {
        autoClickCardCheckbox.checked = result.autoClickCard !== false; // Default true
        autoCheckTermsCheckbox.checked = result.autoCheckTerms !== false; // Default true
        updateStatus();
    });

    // Save settings when changed
    autoClickCardCheckbox.addEventListener('change', function() {
        chrome.storage.local.set({ autoClickCard: this.checked });
        updateStatus();
    });

    autoCheckTermsCheckbox.addEventListener('change', function() {
        chrome.storage.local.set({ autoCheckTerms: this.checked });
        updateStatus();
    });

    // Manual trigger button
    manualTriggerButton.addEventListener('click', function() {
        statusDiv.textContent = '🔄 Đang chạy...';
        statusDiv.style.color = '#007bff';

        // Send message to content script to trigger manually
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'manualTrigger',
                    autoClickCard: autoClickCardCheckbox.checked,
                    autoCheckTerms: autoCheckTermsCheckbox.checked
                }, function(response) {
                    if (response && response.success) {
                        statusDiv.textContent = '✅ Hoàn thành!';
                        statusDiv.style.color = '#28a745';
                        setTimeout(() => updateStatus(), 2000);
                    } else {
                        statusDiv.textContent = '❌ Lỗi: ' + (response ? response.error : 'Không thể kết nối');
                        statusDiv.style.color = '#dc3545';
                        setTimeout(() => updateStatus(), 3000);
                    }
                });
            } else {
                statusDiv.textContent = '❌ Không tìm thấy tab hiện tại';
                statusDiv.style.color = '#dc3545';
                setTimeout(() => updateStatus(), 3000);
            }
        });
    });

    function updateStatus() {
        const cardEnabled = autoClickCardCheckbox.checked;
        const termsEnabled = autoCheckTermsCheckbox.checked;

        if (cardEnabled && termsEnabled) {
            statusDiv.textContent = '✅ Tất cả tính năng đã bật';
            statusDiv.style.color = '#28a745';
        } else if (cardEnabled || termsEnabled) {
            statusDiv.textContent = '⚠️ Một số tính năng đã tắt';
            statusDiv.style.color = '#ffc107';
        } else {
            statusDiv.textContent = '❌ Tất cả tính năng đã tắt';
            statusDiv.style.color = '#dc3545';
        }
    }
});