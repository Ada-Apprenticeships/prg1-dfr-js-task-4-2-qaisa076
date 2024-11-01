const fs = require("fs");

// Check if a file exists.
function fileExists(filename) {
  return fs.existsSync(filename);
}

// Check if a value is a number or a valid numeric string.
function validNumber(value) {
  return typeof value === 'number' ? !isNaN(value) : /^-?\d+(\.\d+)?$/.test(value);
}

// Get the number of rows and columns in the dataframe.
function dataDimensions(dataframe) {
  // Return [-1, -1] if the dataframe is empty or not defined.
  if (!dataframe || (Array.isArray(dataframe) && dataframe.length === 0)) {
    return [-1, -1]; 
  }

  const rows = Array.isArray(dataframe) ? dataframe.length : -1; 
  const cols = rows > 0 && Array.isArray(dataframe[0]) ? dataframe[0].length : -1;

  return [rows, cols];
}

// Calculate the total sum of a dataset.
function findTotal(dataset) {
  // Return 0 if the dataset is not an array or if it has rows and columns.
  if (!Array.isArray(dataset) || (dataset.length > 0 && Array.isArray(dataset[0]))) {
    return 0; 
  }

  let total = 0;

  for (const item of dataset) {
    // Add up valid numbers.
    if (validNumber(item)) {
      total += parseFloat(item);
    }
  }
  return total;
}

// Calculate the average (mean) of a dataset.
function calculateMean(dataset) {
  // Return 0 if the dataset is not a one-dimensional array.
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
  // Return the average, or 0 if there are no valid numbers.
  return count > 0 ? total / count : 0;
}

// Calculate the middle value (median) of a dataset.
function calculateMedian(dataset) {
  if (!Array.isArray(dataset)) {
    return 0; // Return 0 if the input is not an array.
  }
  var validNumbers = [];

  // Get valid numbers from the dataset.
  for (var i = 0; i < dataset.length; i++) {
    var num = Number(dataset[i]);
    if (!isNaN(num)) { 
      validNumbers.push(num); 
    }
  }

  if (validNumbers.length === 0) {
    return 0; // Return 0 if there are no valid numbers.
  }

  validNumbers.sort(function(a, b) {
    return a - b; // Sort the numbers to find the median.
  });

  var mid = Math.floor(validNumbers.length / 2);

  // Calculate median based on the count of valid numbers.
  if (validNumbers.length % 2 === 0) {
    return (validNumbers[mid - 1] + validNumbers[mid]) / 2; 
  } else {
    return validNumbers[mid];
  }
}

// Change strings to numbers in a specific column of the dataframe.
function convertToNumber(dataframe, col) {
  let convertedCount = 0;

  for (let i = 1; i < dataframe.length; i++) { 
    const value = dataframe[i][col];

    // Change valid numeric strings to numbers.
    if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
      dataframe[i][col] = parseFloat(value);
      convertedCount++;
    } else if (typeof value === 'number') {
      continue; // Skip if the value is already a number.
    }
  }
  return convertedCount; // Return the count of how many values were changed.
}

// Turn a single-column dataframe into a 1D array.
function flatten(dataframe) {
  const [rows, cols] = dataDimensions(dataframe);
  
  if (rows > 0 && cols === 1) {
    return dataframe.map(row => row[0]); // Get the first column as a flat array.
  }
  return []; // Return an empty array if conditions are not met.
}

// Load CSV data, ignoring certain rows and columns.
function loadCSV(csvFile, ignoreRows, ignoreCols) {
  ignoreRows = ignoreRows || [];
  ignoreCols = ignoreCols || [];

  // Return an empty array if the file does not exist.
  if (!fs.existsSync(csvFile)) {
    return [[], -1, -1];
  }

  const data = fs.readFileSync(csvFile, 'utf-8');
    
  const rows = data.split('\n').map(function(row) {
    return row.split(',').map(function(cell) {
      return cell.trim(); // Remove spaces from each cell.
    });
  });
    
  const totalRows = rows.length;
  const totalCols = totalRows > 0 ? rows[0].length : 0;

  // Remove ignored rows.
  const filteredRows = rows.filter(function(_, index) {
    return !ignoreRows.includes(index);
  });

  // Remove ignored columns.
  const dataframe = filteredRows.map(function(row) {
    return row.filter(function(_, colIndex) {
      return !ignoreCols.includes(colIndex);
    });
  });

  return [dataframe, totalRows, totalCols]; // Return the processed dataframe and its dimensions.
}

// Create a part of the dataframe based on a pattern in a column.
function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  const filteredData = [];

  for (let i = 0; i < dataframe.length; i++) {
    const row = dataframe[i];
    const cellValue = row[columnIndex];

    // Check if the cell value matches the pattern.
    if (cellValue && cellValue.includes(pattern.replace(/\*/g, ''))) {
      const selectedRow = exportColumns.length > 0 
        ? exportColumns.map(colIndex => row[colIndex]) 
        : row;
      filteredData.push(selectedRow);
    }
  }
  return filteredData; // Return the filtered data.
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