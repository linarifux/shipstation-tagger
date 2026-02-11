/**
 * Truncates a string to the first N words.
 * @param {string} str - The product name.
 * @param {number} wordLimit - Number of words to keep.
 * @returns {string}
 */
export const truncateToWords = (str, wordLimit = 5) => {
  if (!str) return '';
  const words = str.trim().split(/\s+/); // Split by any whitespace
  if (words.length <= wordLimit) return str;
  return words.slice(0, wordLimit).join(' ');
};