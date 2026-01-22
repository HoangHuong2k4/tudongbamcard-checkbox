// Element Picker - Chọn phần tử trên trang web (NO OVERLAY VERSION)
(function () {
  let isPickingElement = false;
  let highlightBox = null;
  let originalCursor = "";

  // Tạo highlight box (NO OVERLAY)
  function createHighlightBox() {
    highlightBox = document.createElement("div");
    highlightBox.id = "element-picker-highlight";
    highlightBox.style.cssText = `
            position: absolute;
            border: 3px solid #9c27b0;
            background: rgba(156, 39, 176, 0.15);
            pointer-events: none;
            z-index: 2147483647;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
        `;
    document.body.appendChild(highlightBox);

    // Change cursor
    originalCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";
  }

  // Xóa highlight box
  function removeHighlightBox() {
    if (highlightBox) {
      highlightBox.remove();
      highlightBox = null;
    }
    document.body.style.cursor = originalCursor;
  }

  // Show notification to user
  function showNotification(message, isSuccess = true) {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isSuccess ? "#4CAF50" : "#f44336"};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 400px;
            word-wrap: break-word;
        `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.transition = "opacity 0.3s";
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Tạo CSS selector cho element - IMPROVED VERSION
  function getSelector(element) {
    // Priority 1: ID (best)
    if (element.id) {
      return `#${element.id}`;
    }

    // Priority 2: Unique class combination
    if (element.className && typeof element.className === "string") {
      const classes = element.className
        .split(" ")
        .filter((c) => c.trim())
        .join(".");
      if (classes) {
        const selector = `${element.tagName.toLowerCase()}.${classes}`;
        try {
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        } catch (e) {
          // Invalid selector, continue
        }
      }
    }

    // Priority 3: Data attributes
    const dataAttrs = Array.from(element.attributes).filter((attr) =>
      attr.name.startsWith("data-"),
    );
    for (const attr of dataAttrs) {
      const selector = `${element.tagName.toLowerCase()}[${attr.name}="${attr.value}"]`;
      try {
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      } catch (e) {
        continue;
      }
    }

    // Priority 4: Unique attribute combinations
    const uniqueAttrs = ["name", "type", "role", "aria-label", "data-testid"];
    for (const attrName of uniqueAttrs) {
      const attrValue = element.getAttribute(attrName);
      if (attrValue) {
        const selector = `${element.tagName.toLowerCase()}[${attrName}="${attrValue}"]`;
        try {
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Priority 5: Parent with ID + simple path
    let parent = element.parentElement;
    let currentElement = element;

    while (parent) {
      if (parent.id) {
        // Found parent with ID, create simple selector
        const tag = currentElement.tagName.toLowerCase();
        const baseSelector = `#${parent.id} ${tag}`;

        try {
          const matches = document.querySelectorAll(baseSelector);
          if (matches.length === 1) {
            return baseSelector;
          }

          // Add class if available
          if (
            currentElement.className &&
            typeof currentElement.className === "string"
          ) {
            const classes = currentElement.className
              .split(" ")
              .filter((c) => c.trim())[0];
            if (classes) {
              const classSelector = `#${parent.id} ${tag}.${classes}`;
              if (document.querySelectorAll(classSelector).length === 1) {
                return classSelector;
              }
            }
          }

          // Use nth-of-type as last resort
          const siblings = Array.from(parent.querySelectorAll(tag));
          const index = siblings.indexOf(currentElement) + 1;
          return `#${parent.id} ${tag}:nth-of-type(${index})`;
        } catch (e) {
          // Continue to next parent
        }
      }
      currentElement = parent;
      parent = parent.parentElement;
    }

    // Fallback: Simple tag + nth-of-type
    const tag = element.tagName.toLowerCase();
    const allSame = Array.from(document.querySelectorAll(tag));
    const index = allSame.indexOf(element) + 1;
    return `${tag}:nth-of-type(${index})`;
  }

  // Highlight element khi hover
  function highlightElement(e) {
    if (!isPickingElement || !highlightBox) return;

    const rect = e.target.getBoundingClientRect();
    highlightBox.style.top = rect.top + window.scrollY + "px";
    highlightBox.style.left = rect.left + window.scrollX + "px";
    highlightBox.style.width = rect.width + "px";
    highlightBox.style.height = rect.height + "px";
    highlightBox.style.display = "block";
  }

  // Click để chọn element
  function selectElement(e) {
    if (!isPickingElement) return;

    e.preventDefault();
    e.stopPropagation();

    const selector = getSelector(e.target);

    // Gửi selector về background (sẽ lưu vào storage)
    chrome.runtime.sendMessage(
      {
        action: "elementSelected",
        selector: selector,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("❌ Error sending message:", chrome.runtime.lastError);
          showNotification(
            "❌ Error: " + chrome.runtime.lastError.message,
            false,
          );
        } else {
          showNotification("✅ Selector saved: " + selector);
        }
      },
    );

    stopPicking();
  }

  // Bắt đầu picking
  function startPicking() {
    if (isPickingElement) return;

    isPickingElement = true;
    createHighlightBox();

    // Add event listeners to document
    document.addEventListener("mouseover", highlightElement, true);
    document.addEventListener("click", selectElement, true);

    // ESC để cancel
    const escHandler = function (e) {
      if (e.key === "Escape") {
        stopPicking();
        document.removeEventListener("keydown", escHandler);
        showNotification("⚠️ Element picker cancelled", false);
      }
    };
    document.addEventListener("keydown", escHandler);

    showNotification("🎯 Click on any element to select");
  }

  // Dừng picking
  function stopPicking() {
    isPickingElement = false;
    removeHighlightBox();

    // Remove event listeners
    document.removeEventListener("mouseover", highlightElement, true);
    document.removeEventListener("click", selectElement, true);

    }

  // Listen for messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startPicking") {
      startPicking();
      sendResponse({ success: true });
    }
    return true;
  });
})();
