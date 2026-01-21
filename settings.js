// Settings for Auto Click Card & Checkbox Extension

document.addEventListener('DOMContentLoaded', function() {
    const autoFillSection = document.getElementById('autoFillSection');
    const manualTriggerButton = document.getElementById('manualTrigger');
    const saveSettingsButton = document.getElementById('saveSettings');
    const statusDiv = document.getElementById('status');
    const countrySelect = document.getElementById('country');
    const inputOpacitySelect = document.getElementById('inputOpacity');
    
    // Custom field inputs
    const emailInput = document.getElementById('email');
    const cardCvcInput = document.getElementById('cardCvc');
    const cardExpiryMonthInput = document.getElementById('cardExpiryMonth');
    const cardExpiryYearInput = document.getElementById('cardExpiryYear');
    const emailHint = document.getElementById('emailHint');

    // Load saved settings
    chrome.storage.local.get([
        'country',
        'inputOpacity',
        'email',
        'cardCvc',
        'cardExpiryMonth',
        'cardExpiryYear'
    ], function(result) {
        console.log('Settings loaded:', result);

        // Load settings
        countrySelect.value = result.country || 'KR';
        inputOpacitySelect.value = result.inputOpacity || '1';
        emailInput.value = result.email || '';
        cardCvcInput.value = result.cardCvc || '004';
        cardExpiryMonthInput.value = result.cardExpiryMonth || '02';
        cardExpiryYearInput.value = result.cardExpiryYear || '29';

        // Update email hint based on country
        updateEmailHint(countrySelect.value);

        // Show form section
        autoFillSection.style.display = 'block';

        updateStatus('✅ Cài đặt đã tải');
    });

    // Update email hint when country changes
    function updateEmailHint(countryCode) {
        const countryData = getCountryData(countryCode);
        if (countryData && countryData.email) {
            emailHint.textContent = `Mặc định: ${countryData.email}`;
        }
    }

    // Country select change handler
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        chrome.storage.local.set({ country: selectedCountry });
        updateEmailHint(selectedCountry);
        updateStatus('✅ Đã chọn quốc gia: ' + (selectedCountry === 'KR' ? 'Hàn Quốc' : 'Ấn Độ'));
    });

    // Opacity change handler - update immediately
    inputOpacitySelect.addEventListener('change', function() {
        chrome.storage.local.set({ inputOpacity: this.value });
        
        // Send message to content script to update CSS
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('pay.openai.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateOpacity',
                    opacity: inputOpacitySelect.value
                });
            }
        });
        
        updateStatus('✅ Đã cập nhật độ mờ: ' + this.value);
    });

    // Save settings button
    saveSettingsButton.addEventListener('click', function() {
        const settingsData = {
            country: countrySelect.value,
            inputOpacity: inputOpacitySelect.value,
            email: emailInput.value.trim(),
            cardCvc: cardCvcInput.value.trim() || '004',
            cardExpiryMonth: cardExpiryMonthInput.value,
            cardExpiryYear: cardExpiryYearInput.value
        };

        chrome.storage.local.set(settingsData, function() {
            statusDiv.textContent = '✅ Cài đặt đã được lưu!';
            statusDiv.style.color = '#28a745';
            setTimeout(() => {
                updateStatus('✅ Sẵn sàng');
            }, 2000);
        });
    });

    // Manual trigger button
    manualTriggerButton.addEventListener('click', function() {
        statusDiv.textContent = '🔄 Đang chạy...';
        statusDiv.style.color = '#007bff';

        // Get current settings
        const formData = {
            email: emailInput.value.trim(),
            cardCvc: cardCvcInput.value.trim() || '004',
            cardExpiryMonth: cardExpiryMonthInput.value,
            cardExpiryYear: cardExpiryYearInput.value
        };

        // Send message to content script to trigger manually
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'manualTrigger',
                    country: countrySelect.value,
                    formData: formData
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        statusDiv.textContent = '❌ Lỗi: ' + chrome.runtime.lastError.message;
                        statusDiv.style.color = '#dc3545';
                        setTimeout(() => updateStatus('⚠️ Vui lòng mở trang thanh toán OpenAI'), 3000);
                    } else if (response && response.success) {
                        statusDiv.textContent = '✅ Hoàn thành!';
                        statusDiv.style.color = '#28a745';
                        setTimeout(() => updateStatus('✅ Sẵn sàng'), 2000);
                    } else {
                        statusDiv.textContent = '❌ Lỗi: ' + (response ? response.error : 'Không thể kết nối');
                        statusDiv.style.color = '#dc3545';
                        setTimeout(() => updateStatus('⚠️ Kiểm tra lại trang'), 3000);
                    }
                });
            } else {
                statusDiv.textContent = '❌ Không tìm thấy tab hiện tại';
                statusDiv.style.color = '#dc3545';
                setTimeout(() => updateStatus('⚠️ Vui lòng mở một tab'), 3000);
            }
        });
    });

    function updateStatus(message) {
        statusDiv.textContent = message || '✅ Sẵn sàng';
        if (message && message.includes('❌')) {
            statusDiv.style.color = '#dc3545';
        } else if (message && message.includes('⚠️')) {
            statusDiv.style.color = '#ffc107';
        } else {
            statusDiv.style.color = '#28a745';
        }
    }
});