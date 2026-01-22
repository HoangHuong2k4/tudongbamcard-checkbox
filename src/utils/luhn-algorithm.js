// Luhn Algorithm - Generate valid credit card numbers
// Based on the Luhn check digit algorithm

// Calculate Luhn check digit
function calculateLuhnCheckDigit(cardNumberWithoutCheck) {
  let sum = 0;
  let shouldDouble = true;

  // Iterate from right to left
  for (let i = cardNumberWithoutCheck.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumberWithoutCheck[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  // Check digit is the amount needed to make sum divisible by 10
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
}

// Validate card number using Luhn algorithm
function validateLuhn(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  // Iterate from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Generate valid card number from BIN
function generateValidCardNumber(bin, length = 16) {
  // Generate random digits for middle part (length - bin.length - 1)
  const middleLength = length - bin.length - 1;
  let middlePart = "";

  for (let i = 0; i < middleLength; i++) {
    middlePart += Math.floor(Math.random() * 10);
  }

  // Combine BIN + middle part
  const cardWithoutCheck = bin + middlePart;

  // Calculate and append check digit
  const checkDigit = calculateLuhnCheckDigit(cardWithoutCheck);
  const validCardNumber = cardWithoutCheck + checkDigit;

  return validCardNumber;
}

// Export for use in settings.js
window.generateValidCardNumber = generateValidCardNumber;
window.validateLuhn = validateLuhn;
