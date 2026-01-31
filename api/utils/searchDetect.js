const isNumeric = str => /^\d+$/.test(str);

const isEmail = str =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

const normalizeText = str =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

module.exports = {
  isNumeric,
  isEmail,
  normalizeText
};