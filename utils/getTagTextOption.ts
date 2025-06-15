const getOptionText = (type: string, value: string): string => {
  const optionMap: Record<string, Record<string, string>> = {
    type: { Hot: "Hot", Iced: "Iced" },
    size: { Regular: "Regular", Large: "Large" },
    iceCube: { Ice: "Ice", "Less Ice": "Less Ice", "More Ice": "More Ice" },
    sweet: { Regular: "Regular", "Less Sugar": "Less Sugar" },
    addOns: { Normal: "Normal", Less: "Less", More: "More" },
    spicyLevel: { Mild: "Mild", Medium: "Medium", Hot: "Hot" },
  };

  // Capitalize the value to match key if necessary
  const capitalizedValue = value
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

  return optionMap[type]?.[capitalizedValue] || value;
};

export default getOptionText;
