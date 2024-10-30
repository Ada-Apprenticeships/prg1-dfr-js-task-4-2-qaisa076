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
  if (!Array.isArray(dataset) || (dataset.length > 0 && Array.isArray(dataset[0]))) {
    return 0;
  }

  let total = 0;
  let count = 0;

  for (const item of dataset) {
    if (validNumber(item)) {
        total += parseFloat(item);
        count++;
    }
  }
  return count > 0 ? total / count : 0;
}

function calculateMedian(dataset) {
  if (!Array.isArray(dataset)) {
    return 0;
  }
  var validNumbers = [];

  for (var i = 0; i < dataset.length; i++) {
    var num = Number(dataset[i]);
    if (!isNaN(num)) { 
        validNumbers.push(num); 
    }
  }

  if (validNumbers.length === 0) {
    return 0;
  }

  validNumbers.sort(function(a, b) {
    return a - b;
  });

  var mid = Math.floor(validNumbers.length / 2);

  if (validNumbers.length % 2 === 0) {
    return (validNumbers[mid - 1] + validNumbers[mid]) / 2; 
  } else {
    return validNumbers[mid];
  }
}

function convertToNumber(dataframe, col) {
  let convertedCount = 0;

  for (let i = 1; i < dataframe.length; i++) { 
      const value = dataframe[i][col];

      if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
          dataframe[i][col] = parseFloat(value);
          convertedCount++;
      } else if (typeof value === 'number') {
          continue;
      }
  }
  return convertedCount;
}
function flatten(dataframe) {
  const [rows, cols] = dataDimensions(dataframe);
    
  if (rows > 0 && cols === 1) {
      return dataframe.map(row => row[0]); 
  }
  return [];
}

function loadCSV(csvFile, ignoreRows, ignoreCols) {
  ignoreRows = ignoreRows || [];
  ignoreCols = ignoreCols || [];

  if (!fs.existsSync(csvFile)) {
    return [[], -1, -1];
  }

  const data = fs.readFileSync(csvFile, 'utf-8');
    
  const rows = data.split('\n').map(function(row) {
      return row.split(',').map(function(cell) {
          return cell.trim();
      });
  });
    
  const totalRows = rows.length;
  const totalCols = totalRows > 0 ? rows[0].length : 0;

  const filteredRows = rows.filter(function(_, index) {
      return !ignoreRows.includes(index);
  });

  const dataframe = filteredRows.map(function(row) {
      return row.filter(function(_, colIndex) {
          return !ignoreCols.includes(colIndex);
      });
  });

  return [dataframe, totalRows, totalCols];
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