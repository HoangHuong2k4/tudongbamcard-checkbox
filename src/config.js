// Configuration data for Auto Click Card & Checkbox Extension

// Default data by country
const COUNTRY_DATA = {
  KR: {
    // Korea
    name: "Hàn Quốc",
    email: "huongmmo@example.com",
    billingName: "HUONG MMO",
    billingAddressLine1: "HUONG MMO",
    billingAddressLine2: "HUONG MMO, HUONG MMO",
    billingCity: "HUONG MMO",
    billingDependentLocality: "HUONGMMO",
    billingPostalCode: "11004",
    billingState: "경상북도",
  },
  IN: {
    // India
    name: "Ấn Độ",
    email: "huongmmo@example.com",
    billingName: "HUONG MMO",
    billingAddressLine1: "Copernicus Marg",
    billingAddressLine2: "",
    billingCity: "New Delhi",
    billingPostalCode: "110001",
    billingState: "DL",
  },
};

// Available countries for selection
const AVAILABLE_COUNTRIES = ["KR", "IN"];

// Default BINs (Bank Identification Numbers)
const DEFAULT_BINS = [
  { name: "BIN GPT Plus", number: "623341" },
  { name: "BIN GPT Go", number: "456789" },
  { name: "Default (All Zeros)", number: "000000" },
];

// Default settings
const DEFAULT_SETTINGS = {
  country: "KR",
  inputOpacity: "1",
  email: "",
  cardNumber: "0000000000000000",
  cardCvc: "004",
  cardExpiryMonth: "02",
  cardExpiryYear: "29",
  billingName: "HUONG MMO",
  billingAddressLine1: "HUONG MMO",
  billingAddressLine2: "HUONG MMO, HUONG MMO",
  billingCity: "HUONG MMO",
  billingDependentLocality: "HUONGMMO",
  billingPostalCode: "11004",
  billingState: "경상북도",
  clickSelector:
    "span.SubmitButton-Text.SubmitButton-Text--pre.Text.Text-color--default.Text-fontWeight--500.Text--truncate",
  clickDelay: 2,
  autoClickEnabled: false,
  savedBins: DEFAULT_BINS,
  selectedBinIndex: 0,
};

// Get country data by code
function getCountryData(countryCode) {
  return COUNTRY_DATA[countryCode] || COUNTRY_DATA["KR"];
}

// Get all available countries
function getAvailableCountries() {
  return AVAILABLE_COUNTRIES;
}

// Get default settings
function getDefaultSettings() {
  return { ...DEFAULT_SETTINGS };
}
