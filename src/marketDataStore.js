let marketData = {};

export const setMarketData = (newData) => {
  marketData = { ...marketData, ...newData };
};

export const getMarketData = () => marketData;

export const getMetalData = (metal) => marketData[metal] || {};