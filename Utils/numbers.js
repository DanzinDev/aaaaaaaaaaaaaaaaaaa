module.exports = (number) => {

  const symbols = [ '', 'K', 'B', 'T', 'Qa', 'Qi', 'Sx','Sp', 'Oc']//, 'No', 'Dc' ];

  const tier = Math.log10(number) / 3 | 0;

  if (tier == 0) return number;
  if (tier >= (symbols.length)) return number.toLocaleString().replace(/,/g, ".");

  const prefix = symbols[tier];

  const scale = Math.pow(10, tier * 3);

  const scaled = number / scale;
  
  const scaledOneDigit = Math.trunc(scaled * 10) / 10 ;
  
  return scaledOneDigit + prefix;

}