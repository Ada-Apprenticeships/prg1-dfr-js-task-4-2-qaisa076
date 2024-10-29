const fs = require("fs");

function fileExists(filename) {
  return fs.existsSync(filename);
}

function validNumber(value) {
  return typeof value === 'number' ? !isNaN(value) : /^-?\d+(\.\d+)?$/.test(value);
}

function dataDimensions(dataframe) {
  if (!dataframe || (Array.isArray(dataframe) && dataframe.length === 0)) {
    return [-1, -1]; 
  }

  const rows = Array.isArray(dataframe) ? dataframe.length : -1;
  const cols = rows > 0 && Array.isArray(dataframe[0]) ? dataframe[0].length : -1;

return [rows, cols];
}

function findTotal(dataset) {
  if (!Array.isArray(dataset) || (dataset.length > 0 && Array.isArray(dataset[0]))) {
    return 0; 
  }

  let total = 0;

  for (const item of dataset) {
    if (validNumber(item)) {
        total += parseFloat(item);
    }
}
return total;
}

function calculateMean(dataset) {

}

function calculateMedian(dataset) {

}

function convertToNumber(dataframe, col) {

}

function flatten(dataframe) {

}

function loadCSV(csvFile, ignoreRows, ignoreCols) {

}


function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {

}

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};