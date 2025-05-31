const getOptionText = (type: string, value: string): string => {
    const optionMap: Record<string, Record<string, string>> = {
      type: { hot: "Hot", iced: "Iced" },
      size: { regular: "Regular", large: "Large" },
      iceCube: { regular: "Ice", less: "Less Ice", more: "More Ice" },
      sweet: { regular: "Regular", less: "Less Sugar" },
    };
    return optionMap[type]?.[value] || value;
};
  
export default getOptionText;