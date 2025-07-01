import { useState, useEffect,useRef } from "react"; // Added useEffect import
// CurrencyInput component
const CurrencyInput = ({
  id,
  value,
  onChange,
  currencySymbol = '$',
  decimalSeparator = '.',
  groupSeparator = ',',
  precision = 2,
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef(null);

  // Effect to update displayValue when the external value prop changes
  useEffect(() => {
    // If the value is empty, clear the display
    if (value === '') {
      setDisplayValue('');
      return;
    }
    // Format the incoming value for display
    const formatted = formatCurrency(value, currencySymbol, decimalSeparator, groupSeparator, precision);
    setDisplayValue(formatted);
  }, [value, currencySymbol, decimalSeparator, groupSeparator, precision]);

  // Function to format a raw number string into currency
  const formatCurrency = (
    numStr,
    symbol,
    decSeparator,
    grpSeparator,
    prec
  ) => {
    // Clean the input: remove symbol, group separators, and multiple decimal points
    let cleanNumStr = numStr.replace(new RegExp(`\\${symbol}|\\${grpSeparator}`, 'g'), '');
    const parts = cleanNumStr.split(decSeparator);
    cleanNumStr = parts[0] + (parts[1] ? decSeparator + parts[1].substring(0, prec) : '');

    // Handle empty string or just the decimal separator
    if (cleanNumStr === '' || cleanNumStr === decSeparator) {
      return '';
    }

    // Convert to a number to handle leading zeros and ensure valid number
    let num = parseFloat(cleanNumStr);
    if (isNaN(num)) {
      return ''; // Return empty if not a valid number
    }

    // Format the integer part with group separators
    let integerPart = Math.floor(Math.abs(num)).toString();
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, grpSeparator);

    // Format the decimal part
    let decimalPart = '';
    if (prec > 0) {
      let fraction = (Math.abs(num) - Math.floor(Math.abs(num))).toFixed(prec).substring(2);
      decimalPart = decSeparator + fraction;
    }

    // Add negative sign if necessary
    const sign = num < 0 ? '-' : '';

    return `${sign}${symbol}${integerPart}${decimalPart}`;
  };

  // Function to clean the display value back to a raw number string
  const cleanForStorage = (displayStr, symbol, decSeparator, grpSeparator) => {
    if (displayStr === null || displayStr === undefined) return '';
    let cleaned = displayStr.toString().replace(new RegExp(`\\${symbol}|\\${grpSeparator}`, 'g'), '');
    // Replace the custom decimal separator with a standard dot for parseFloat
    cleaned = cleaned.replace(decSeparator, '.');
    return cleaned;
  };

  // Handle input change event
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Remove anything that is not a digit or the decimal separator
    // Allow only one decimal separator
    let cleanedValue = inputValue.replace(new RegExp(`[^0-9\\${decimalSeparator}]`, 'g'), '');
    const parts = cleanedValue.split(decimalSeparator);
    if (parts.length > 2) {
      // If more than one decimal, keep only the first one
      cleanedValue = parts[0] + decimalSeparator + parts.slice(1).join('');
    }

    // If the cleaned value is just a decimal separator, treat it as "0."
    if (cleanedValue === decimalSeparator) {
      cleanedValue = '0' + decimalSeparator;
    }

    // If the cleaned value starts with "0" and is not "0." or "0", remove leading zeros
    if (cleanedValue.length > 1 && cleanedValue[0] === '0' && cleanedValue[1] !== decimalSeparator) {
        cleanedValue = cleanedValue.substring(1);
    }

    // If the cleaned value is empty, set display value to empty and emit empty string
    if (cleanedValue === '') {
      setDisplayValue('');
      onChange('');
      return;
    }

    // Format the cleaned value for display
    const formatted = formatCurrency(cleanedValue, currencySymbol, decimalSeparator, groupSeparator, precision);
    setDisplayValue(formatted);

    // Emit the cleaned, unformatted value (e.g., "1234.56")
    const rawValue = cleanForStorage(formatted, currencySymbol, decimalSeparator, groupSeparator);
    onChange(rawValue);
  };

  // Handle blur event to ensure proper formatting when user leaves the field
  const handleBlur = () => {
    if (displayValue === '' || displayValue === currencySymbol) {
      onChange(''); // Clear the value if nothing was entered or only symbol
      setDisplayValue('');
    } else {
      // Re-format to ensure precision is applied correctly on blur
      const rawValue = cleanForStorage(displayValue, currencySymbol, decimalSeparator, groupSeparator);
      const formatted = formatCurrency(rawValue, currencySymbol, decimalSeparator, groupSeparator, precision);
      setDisplayValue(formatted);
      onChange(rawValue); // Ensure the stored value is consistent
    }
  };

  // Handle focus event to remove formatting for easier editing
  const handleFocus = () => {
    const rawValue = cleanForStorage(displayValue, currencySymbol, decimalSeparator, groupSeparator);
    setDisplayValue(rawValue);
  };

  return (
    <input
      id={id}
      type="text"
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    //   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-right font-mono"
      className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
      placeholder={`${currencySymbol}0${decimalSeparator}00`}
      aria-label="Currency Input Field"
    />
  );
};

export default CurrencyInput;