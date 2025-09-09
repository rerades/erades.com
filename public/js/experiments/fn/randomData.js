/**
 * Simple random data loader
 */
const dataFiles = [
  "./data/data0.js",
  "./data/data1.js",
  "./data/data2.js",
  "./data/data3.js",
  "./data/data4.js",
  "./data/data5.js",
];

export const loadRandomData = async () => {
  const randomFile = dataFiles[Math.floor(Math.random() * dataFiles.length)];
  const module = await import(randomFile);
  return module.Data;
};
