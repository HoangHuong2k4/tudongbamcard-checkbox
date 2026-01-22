// Settings for Auto Click Card & Checkbox Extension

document.addEventListener("DOMContentLoaded", function () {
  const autoFillSection = document.getElementById("autoFillSection");
  const manualTriggerButton = document.getElementById("manualTrigger");
  const saveSettingsButton = document.getElementById("saveSettings");
  const statusDiv = document.getElementById("status");
  const countrySelect = document.getElementById("country");
  const inputOpacitySelect = document.getElementById("inputOpacity");

  // Custom field inputs
  const emailInput = document.getElementById("email");
  const cardNumberInput = document.getElementById("cardNumberInput");
  const cardNumberHint = document.getElementById("cardNumberHint");
  const cardCvcInput = document.getElementById("cardCvc");
  const cardExpiryMonthInput = document.getElementById("cardExpiryMonth");
  const cardExpiryYearInput = document.getElementById("cardExpiryYear");
  const emailHint = document.getElementById("emailHint");

  // Auto-click inputs
  const pickElementBtn = document.getElementById("pickElementBtn");
  const clickSelectorInput = document.getElementById("clickSelector");
  const clickDelayInput = document.getElementById("clickDelay");
  const autoClickEnabledCheckbox = document.getElementById("autoClickEnabled");

  // BIN management
  const binSelect = document.getElementById("binSelect");
  const manageBinsBtn = document.getElementById("manageBinsBtn");
  const binModal = document.getElementById("binModal");
  const closeBinModal = document.getElementById("closeBinModal");
  const addBinBtn = document.getElementById("addBinBtn");
  const newBinName = document.getElementById("newBinName");
  const newBinNumber = document.getElementById("newBinNumber");
  const binList = document.getElementById("binList");

  let savedBins = [];
  let selectedBinIndex = 0;

  // Load saved settings
  chrome.storage.local.get(
    [
      "country",
      "inputOpacity",
      "email",
      "cardNumber",
      "cardCvc",
      "cardExpiryMonth",
      "cardExpiryYear",
      "clickSelector",
      "clickDelay",
      "autoClickEnabled",
    ],
    function (result) {
      // Load settings
      countrySelect.value = result.country || "KR";
      inputOpacitySelect.value = result.inputOpacity || "1";
      emailInput.value = result.email || "";
      cardNumberInput.value = result.cardNumber || "";
      cardCvcInput.value = result.cardCvc || "004";
      cardExpiryMonthInput.value = result.cardExpiryMonth || "02";
      cardExpiryYearInput.value = result.cardExpiryYear || "29";

      // Load auto-click settings
      clickSelectorInput.value =
        result.clickSelector || DEFAULT_SETTINGS.clickSelector || "";
      clickDelayInput.value =
        result.clickDelay || DEFAULT_SETTINGS.clickDelay || 2;
      autoClickEnabledCheckbox.checked =
        result.autoClickEnabled || DEFAULT_SETTINGS.autoClickEnabled || false;

      // Show hint if selector exists
      if (result.clickSelector) {
        updateStatus("ℹ️ Auto-click selector loaded: " + result.clickSelector);
      }

      // Update email hint based on country
      updateEmailHint(countrySelect.value);

      // Show form section
      autoFillSection.style.display = "block";

      updateStatus("✅ Cài đặt đã tải");
    },
  );

  // Update email hint when country changes
  function updateEmailHint(countryCode) {
    const countryData = getCountryData(countryCode);
    if (countryData && countryData.email) {
      emailHint.textContent = `Mặc định: ${countryData.email}`;
    }
  }

  // Country select change handler
  countrySelect.addEventListener("change", function () {
    const selectedCountry = this.value;
    chrome.storage.local.set({ country: selectedCountry });
    updateEmailHint(selectedCountry);
    updateStatus(
      "✅ Đã chọn quốc gia: " +
        (selectedCountry === "KR" ? "Hàn Quốc" : "Ấn Độ"),
    );
  });

  // Card number input handler - auto-fill zeros
  cardNumberInput.addEventListener("input", function () {
    // Only allow digits
    this.value = this.value.replace(/\D/g, "");

    const inputLength = this.value.length;
    if (inputLength > 0) {
      // Calculate how many zeros to add
      const zerosNeeded = 16 - inputLength;
      const fullCardNumber = this.value + "0".repeat(zerosNeeded);
      cardNumberHint.textContent = `Kết quả: ${fullCardNumber} (${inputLength} số nhập + ${zerosNeeded} số 0)`;
      cardNumberHint.style.color = "#28a745";
    } else {
      cardNumberHint.textContent = "Mặc định: 0000000000000000 (16 số 0)";
      cardNumberHint.style.color = "#666";
    }
  });

  // Pick element button
  pickElementBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        // Inject element-picker.js
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            files: ["element-picker.js"],
          })
          .then(() => {
            // Send message to start picking
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "startPicking",
            });
            updateStatus("🎯 Click on element to select...");
          })
          .catch((err) => {
            updateStatus("❌ Error: " + err.message);
          });
      }
    });
  });

  // Listen for selected element
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "elementSelected") {
      clickSelectorInput.value = request.selector;
      updateStatus("✅ Element selected: " + request.selector);
    }
  });

  // Opacity change handler - update immediately
  inputOpacitySelect.addEventListener("change", function () {
    chrome.storage.local.set({ inputOpacity: this.value });

    // Send message to content script to update CSS
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes("pay.openai.com")) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateOpacity",
          opacity: inputOpacitySelect.value,
        });
      }
    });

    updateStatus("✅ Đã cập nhật độ mờ: " + this.value);
  });

  // Save settings button
  saveSettingsButton.addEventListener("click", function () {
    // Generate card number from selected BIN
    const bin = savedBins[selectedBinIndex];
    const remainingDigits = 16 - bin.number.length;

    let cardNumber;
    // Special case: if BIN is all zeros, keep all zeros
    if (
      bin.number === "000000" ||
      bin.number === "0000" ||
      bin.number === "00000" ||
      bin.number === "000000000"
    ) {
      cardNumber = "0000000000000000";
    } else {
      // Generate VALID card number using Luhn algorithm
      cardNumber = window.generateValidCardNumber(bin.number, 16);
    }

    const settingsData = {
      country: countrySelect.value,
      inputOpacity: inputOpacitySelect.value,
      email: emailInput.value.trim(),
      cardNumber: cardNumber,
      cardCvc: cardCvcInput.value.trim() || "004",
      cardExpiryMonth: cardExpiryMonthInput.value,
      cardExpiryYear: cardExpiryYearInput.value,
      clickSelector: clickSelectorInput.value.trim(),
      clickDelay: parseFloat(clickDelayInput.value) || 2,
      autoClickEnabled: autoClickEnabledCheckbox.checked,
      savedBins: savedBins,
      selectedBinIndex: selectedBinIndex,
    };

    chrome.storage.local.set(settingsData, function () {
      statusDiv.textContent = "✅ Cài đặt đã được lưu!";
      statusDiv.style.color = "#28a745";
      setTimeout(() => {
        updateStatus("✅ Sẵn sàng");
      }, 2000);
    });
  });

  // Manual trigger button
  manualTriggerButton.addEventListener("click", function () {
    statusDiv.textContent = "🔄 Đang chạy...";
    statusDiv.style.color = "#007bff";

    // Process card number - pad with zeros if needed
    let cardNumber = cardNumberInput.value.trim();
    if (cardNumber) {
      cardNumber = cardNumber.replace(/\D/g, ""); // Remove non-digits
      if (cardNumber.length < 16) {
        cardNumber = cardNumber + "0".repeat(16 - cardNumber.length);
      }
    } else {
      cardNumber = "0000000000000000"; // Default to all zeros
    }

    // Get current settings
    const formData = {
      email: emailInput.value.trim(),
      cardNumber: cardNumber,
      cardCvc: cardCvcInput.value.trim() || "004",
      cardExpiryMonth: cardExpiryMonthInput.value,
      cardExpiryYear: cardExpiryYearInput.value,
    };

    // Send message to content script to trigger manually
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "manualTrigger",
            country: countrySelect.value,
            formData: formData,
          },
          function (response) {
            if (chrome.runtime.lastError) {
              statusDiv.textContent =
                "❌ Lỗi: " + chrome.runtime.lastError.message;
              statusDiv.style.color = "#dc3545";
              setTimeout(
                () => updateStatus("⚠️ Vui lòng mở trang thanh toán OpenAI"),
                3000,
              );
            } else if (response && response.success) {
              statusDiv.textContent = "✅ Hoàn thành!";
              statusDiv.style.color = "#28a745";
              setTimeout(() => updateStatus("✅ Sẵn sàng"), 2000);
            } else {
              statusDiv.textContent =
                "❌ Lỗi: " + (response ? response.error : "Không thể kết nối");
              statusDiv.style.color = "#dc3545";
              setTimeout(() => updateStatus("⚠️ Kiểm tra lại trang"), 3000);
            }
          },
        );
      } else {
        statusDiv.textContent = "❌ Không tìm thấy tab hiện tại";
        statusDiv.style.color = "#dc3545";
        setTimeout(() => updateStatus("⚠️ Vui lòng mở một tab"), 3000);
      }
    });
  });

  // ============================================
  // BIN MANAGEMENT
  // ============================================

  // Load BINs from storage
  chrome.storage.local.get(["savedBins", "selectedBinIndex"], (result) => {
    savedBins = result.savedBins || DEFAULT_SETTINGS.savedBins;
    selectedBinIndex = result.selectedBinIndex || 0;

    populateBinSelect();
    updateCardNumberFromBin();
  });

  // Populate BIN select dropdown
  function populateBinSelect() {
    binSelect.innerHTML = "";
    savedBins.forEach((bin, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${bin.name} (${bin.number})`;
      binSelect.appendChild(option);
    });
    binSelect.value = selectedBinIndex;
  }

  // Update card number when BIN changes
  binSelect.addEventListener("change", () => {
    selectedBinIndex = parseInt(binSelect.value);
    updateCardNumberFromBin();
    chrome.storage.local.set({ selectedBinIndex });
    updateStatus("✅ Đã chọn BIN: " + savedBins[selectedBinIndex].name);
  });

  // Update card number input from selected BIN
  function updateCardNumberFromBin() {
    const bin = savedBins[selectedBinIndex];
    if (bin) {
      // Special case: if BIN is all zeros, display all zeros
      if (
        bin.number === "000000" ||
        bin.number === "0000" ||
        bin.number === "00000" ||
        bin.number === "000000000"
      ) {
        cardNumberInput.value = "0000000000000000";
        cardNumberHint.textContent = "Số thẻ: 16 số 0";
      } else {
        // Display as BIN + X pattern (e.g., 623341XXXXXXXXXX)
        const displayNumber = bin.number + "X".repeat(16 - bin.number.length);
        cardNumberInput.value = displayNumber;
        cardNumberHint.textContent = `BIN: ${bin.number} (${bin.number.length} số) + ${16 - bin.number.length} số ngẫu nhiên khi fill`;
      }
      cardNumberHint.style.color = "#28a745";
    }
  }

  // Open BIN management modal
  manageBinsBtn.addEventListener("click", () => {
    binModal.style.display = "block";
    renderBinList();
  });

  // Close modal
  closeBinModal.addEventListener("click", () => {
    binModal.style.display = "none";
  });

  // Add new BIN
  addBinBtn.addEventListener("click", () => {
    const name = newBinName.value.trim();
    const number = newBinNumber.value.trim().replace(/\D/g, "");

    if (!name || !number) {
      alert("Vui lòng nhập tên và số BIN");
      return;
    }

    if (number.length < 4 || number.length > 8) {
      alert("Số BIN phải từ 4-8 chữ số");
      return;
    }

    savedBins.push({ name, number });
    chrome.storage.local.set({ savedBins });

    newBinName.value = "";
    newBinNumber.value = "";

    populateBinSelect();
    renderBinList();
    updateStatus("✅ Đã thêm BIN: " + name);
  });

  // Render BIN list in modal
  function renderBinList() {
    binList.innerHTML = "";
    if (savedBins.length === 0) {
      binList.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #999;">Chưa có BIN nào</div>';
      return;
    }

    savedBins.forEach((bin, index) => {
      const item = document.createElement("div");
      item.style.cssText =
        "padding: 10px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;";

      // Create elements
      const nameSpan = document.createElement("span");
      nameSpan.innerHTML = `<strong>${bin.name}</strong>: ${bin.number}`;

      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = "display: flex; gap: 5px;";

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ Sửa";
      editBtn.style.cssText =
        "background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;";
      editBtn.addEventListener("click", () => editBin(index));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️ Xóa";
      deleteBtn.style.cssText =
        "background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;";
      deleteBtn.addEventListener("click", () => deleteBin(index));

      buttonContainer.appendChild(editBtn);
      buttonContainer.appendChild(deleteBtn);

      item.appendChild(nameSpan);
      item.appendChild(buttonContainer);
      binList.appendChild(item);
    });
  }

  // Delete BIN
  function deleteBin(index) {
    if (savedBins.length <= 1) {
      alert("Không thể xóa! Phải có ít nhất 1 BIN");
      return;
    }

    if (confirm(`Xóa BIN "${savedBins[index].name}"?`)) {
      savedBins.splice(index, 1);

      // Adjust selected index if needed
      if (selectedBinIndex >= savedBins.length) {
        selectedBinIndex = Math.max(0, savedBins.length - 1);
      }

      chrome.storage.local.set({ savedBins, selectedBinIndex });
      populateBinSelect();
      renderBinList();
      updateCardNumberFromBin();
      updateStatus("✅ Đã xóa BIN");
    }
  }

  // Edit BIN
  window.editBin = function (index) {
    const bin = savedBins[index];

    // Prompt for new name
    const newName = prompt(`Sửa tên BIN:`, bin.name);
    if (newName === null) return; // User cancelled

    const trimmedName = newName.trim();
    if (!trimmedName) {
      alert("Tên BIN không được để trống");
      return;
    }

    // Prompt for new number
    const newNumber = prompt(`Sửa số BIN (4-8 chữ số):`, bin.number);
    if (newNumber === null) return; // User cancelled

    const trimmedNumber = newNumber.trim().replace(/\D/g, "");
    if (!trimmedNumber) {
      alert("Số BIN không được để trống");
      return;
    }

    if (trimmedNumber.length < 4 || trimmedNumber.length > 8) {
      alert("Số BIN phải từ 4-8 chữ số");
      return;
    }

    // Update BIN
    savedBins[index] = { name: trimmedName, number: trimmedNumber };
    chrome.storage.local.set({ savedBins });

    populateBinSelect();
    renderBinList();
    updateCardNumberFromBin();
    updateStatus("✅ Đã sửa BIN: " + trimmedName);
  };

  function updateStatus(message) {
    statusDiv.textContent = message || "✅ Sẵn sàng";
    if (message && message.includes("❌")) {
      statusDiv.style.color = "#dc3545";
    } else if (message && message.includes("⚠️")) {
      statusDiv.style.color = "#ffc107";
    } else {
      statusDiv.style.color = "#28a745";
    }
  }
});
