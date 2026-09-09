const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

/**
 * Normalizes state name to match standard GeoJSON state names
 */
function normalizeStateName(inputState) {
  if (!inputState) return null;
  const cleanInput = String(inputState).trim().toLowerCase();
  
  // Quick direct or alias mappings
  const aliases = {
    'delhi': 'Delhi',
    'nct of delhi': 'Delhi',
    'orissa': 'Odisha',
    'pondicherry': 'Puducherry',
    'daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'j&k': 'Jammu and Kashmir',
    'jammu & kashmir': 'Jammu and Kashmir',
    'up': 'Uttar Pradesh',
    'mp': 'Madhya Pradesh',
    'ap': 'Andhra Pradesh',
    'tn': 'Tamil Nadu',
    'wb': 'West Bengal'
  };

  if (aliases[cleanInput]) return aliases[cleanInput];

  const match = INDIAN_STATES.find(s => s.toLowerCase() === cleanInput);
  return match || null;
}

/**
 * Validates parsed CSV rows against selected chartType schema.
 * @param {Array<Object>} rows Array of raw row objects from CSV
 * @param {string} chartType Selected visualization type
 * @returns {Object} { isValid, errors, parsedData, columns }
 */
function validateCSV(rows, chartType) {
  const errors = [];
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return {
      isValid: false,
      errors: ['CSV file is empty or could not be parsed.'],
      parsedData: [],
      columns: [],
    };
  }

  // Extract columns from first row
  const rawHeaders = Object.keys(rows[0]);
  const columns = rawHeaders.map(h => h.trim());
  const normalizedHeaders = columns.map(h => h.toLowerCase());

  if (rows.length > 5000) {
    errors.push('CSV exceeds maximum allowed limit of 5,000 rows.');
  }

  const parsedData = [];

  // Helper column pickers
  const findColumn = (aliases) => {
    return columns.find(c => aliases.includes(c.toLowerCase()));
  };

  if (chartType === 'latlng') {
    const latCol = findColumn(['latitude', 'lat', 'lat_deg', 'y']);
    const lngCol = findColumn(['longitude', 'lng', 'lon', 'long', 'x']);
    const valCol = findColumn(['value', 'metric', 'intensity', 'power', 'capacity', 'temp', 'aqi', 'reading']);
    const nameCol = findColumn(['name', 'title', 'location', 'station', 'site', 'city']);

    if (!latCol || !lngCol) {
      errors.push(
        `Missing required coordinates columns for Latitude/Longitude chart. Expected headers: 'latitude' and 'longitude'. Found: [${columns.join(', ')}]`
      );
    }
    if (!valCol) {
      errors.push(
        `Missing numeric metric column for Latitude/Longitude map. Expected a 'value' or metric column.`
      );
    }

    if (errors.length > 0) {
      return { isValid: false, errors, parsedData: [], columns };
    }

    rows.forEach((row, idx) => {
      const lineNum = idx + 2; // header is line 1
      const latVal = parseFloat(row[latCol]);
      const lngVal = parseFloat(row[lngCol]);
      const metricVal = parseFloat(row[valCol]);
      const locationName = nameCol && row[nameCol] ? String(row[nameCol]).trim() : `Point ${idx + 1}`;

      if (isNaN(latVal) || latVal < -90 || latVal > 90) {
        errors.push(`Row ${lineNum}: Invalid latitude '${row[latCol]}'. Must be a number between -90 and 90.`);
      }
      if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
        errors.push(`Row ${lineNum}: Invalid longitude '${row[lngCol]}'. Must be a number between -180 and 180.`);
      }
      if (isNaN(metricVal)) {
        errors.push(`Row ${lineNum}: Invalid metric value '${row[valCol]}'. Must be a valid number.`);
      }

      if (errors.length <= 10) { // store up to 10 errors max before failing
        parsedData.push({
          latitude: latVal,
          longitude: lngVal,
          value: metricVal,
          name: locationName,
          ...row,
        });
      }
    });

  } else if (chartType === 'statewise') {
    const stateCol = findColumn(['state', 'state_name', 'state/ut', 'region', 'province']);
    const valCol = findColumn(['value', 'capacity', 'generation', 'consumption', 'aqi', 'metric', 'total']);

    if (!stateCol) {
      errors.push(
        `Missing state column for State-wise heatmap. Expected header 'state' or 'state_name'. Found: [${columns.join(', ')}]`
      );
    }
    if (!valCol) {
      errors.push(
        `Missing value column for State-wise heatmap. Expected header 'value' or metric.`
      );
    }

    if (errors.length > 0) {
      return { isValid: false, errors, parsedData: [], columns };
    }

    rows.forEach((row, idx) => {
      const lineNum = idx + 2;
      const rawState = row[stateCol];
      const normState = normalizeStateName(rawState);
      const metricVal = parseFloat(row[valCol]);

      if (!normState) {
        errors.push(
          `Row ${lineNum}: Unrecognized Indian state name '${rawState}'. Please use standard Indian State/UT names (e.g. Maharashtra, Tamil Nadu, Delhi).`
        );
      }
      if (isNaN(metricVal)) {
        errors.push(`Row ${lineNum}: Invalid value '${row[valCol]}' for state '${rawState}'. Must be a number.`);
      }

      if (errors.length <= 10) {
        parsedData.push({
          state: normState || rawState,
          originalState: rawState,
          value: metricVal,
          ...row,
        });
      }
    });

  } else if (chartType.startsWith('timeseries')) {
    const timeCol = findColumn(['date', 'year', 'time', 'timestamp', 'period', 'month']);
    const valCol = findColumn(['value', 'val', 'reading', 'metric', 'power', 'capacity', 'temp', 'generation', 'demand']);

    // If valCol is not found, take the first non-time numeric column
    let selectedValCol = valCol;
    if (!selectedValCol) {
      selectedValCol = columns.find(c => c !== timeCol);
    }

    if (!timeCol) {
      errors.push(
        `Missing time dimension column for Time-Series chart. Expected header 'date', 'year', or 'period'. Found: [${columns.join(', ')}]`
      );
    }
    if (!selectedValCol) {
      errors.push(
        `Missing numeric metric column for Time-Series chart.`
      );
    }

    if (errors.length > 0) {
      return { isValid: false, errors, parsedData: [], columns };
    }

    rows.forEach((row, idx) => {
      const lineNum = idx + 2;
      const rawTime = row[timeCol];
      const metricVal = parseFloat(row[selectedValCol]);

      if (!rawTime || String(rawTime).trim() === '') {
        errors.push(`Row ${lineNum}: Empty date or year value.`);
      }
      if (isNaN(metricVal)) {
        errors.push(`Row ${lineNum}: Invalid numeric value '${row[selectedValCol]}' for date '${rawTime}'.`);
      }

      if (errors.length <= 10) {
        parsedData.push({
          date: String(rawTime).trim(),
          value: metricVal,
          ...row,
        });
      }
    });

  } else {
    errors.push(`Unsupported visualization chart type: ${chartType}`);
  }

  // If there are errors, return failure with top error messages
  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors.slice(0, 15), // cap at 15 readable error lines
      parsedData: [],
      columns,
    };
  }

  return {
    isValid: true,
    errors: [],
    parsedData,
    columns,
  };
}

module.exports = {
  validateCSV,
  normalizeStateName,
  INDIAN_STATES,
};
