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
 * Automatically detects the best visualization chart type based on headers and sample values
 */
function autoDetectChartType(rows, columns) {
  if (!columns || columns.length === 0) return 'timeseries_line';
  const lowerCols = columns.map(c => c.toLowerCase());

  // 1. Check for Latitude + Longitude coordinates
  const hasLat = lowerCols.some(c => ['latitude', 'lat', 'lat_deg', 'y'].includes(c));
  const hasLng = lowerCols.some(c => ['longitude', 'lng', 'lon', 'long', 'x'].includes(c));
  if (hasLat && hasLng) return 'latlng';

  // 2. Check for Indian state names
  const hasStateCol = lowerCols.some(c => ['state', 'state_name', 'state/ut', 'region', 'province'].includes(c));
  if (hasStateCol) return 'statewise';

  // 3. Count numeric columns
  let numericColCount = 0;
  if (rows && rows.length > 0) {
    const sampleRow = rows[0];
    columns.forEach(col => {
      const val = parseFloat(sampleRow[col]);
      if (!isNaN(val)) numericColCount++;
    });
  }

  // 4. Check for Pie / Doughnut (category + percentage/share or sum to ~100)
  const isPieCandidate = lowerCols.some(c => ['percent', 'percentage', 'share', 'portion', 'distribution'].includes(c));
  if (isPieCandidate) return 'pie';

  // 5. Check for Multiple Numeric Columns (Multi-line)
  const timeCol = lowerCols.find(c => ['date', 'year', 'time', 'timestamp', 'period', 'month'].includes(c));
  if (timeCol && numericColCount >= 2) return 'multiline';

  // 6. Time-series or Category Bar
  if (timeCol) return 'timeseries_line';

  // 7. Categories + Numbers -> Bar Chart
  if (numericColCount === 1) return 'timeseries_bar';

  return 'timeseries_line';
}

/**
 * Validates parsed CSV rows against selected chartType schema.
 * @param {Array<Object>} rows Array of raw row objects from CSV
 * @param {string} chartType Selected visualization type or 'auto'
 * @returns {Object} { isValid, errors, parsedData, columns, detectedChartType }
 */
function validateCSV(rows, chartType = 'auto') {
  const errors = [];
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return {
      isValid: false,
      errors: ['CSV file is empty or could not be parsed.'],
      parsedData: [],
      columns: [],
      detectedChartType: 'timeseries_line',
    };
  }

  // Extract columns from first row
  const rawHeaders = Object.keys(rows[0]);
  const columns = rawHeaders.map(h => h.trim());

  if (rows.length > 5000) {
    errors.push('CSV exceeds maximum allowed limit of 5,000 rows.');
  }

  // Auto detect chart type if requested or auto
  let finalChartType = chartType;
  if (!finalChartType || finalChartType === 'auto') {
    finalChartType = autoDetectChartType(rows, columns);
  }

  const parsedData = [];

  const findColumn = (aliases) => {
    return columns.find(c => aliases.includes(c.toLowerCase()));
  };

  if (finalChartType === 'latlng') {
    const latCol = findColumn(['latitude', 'lat', 'lat_deg', 'y']);
    const lngCol = findColumn(['longitude', 'lng', 'lon', 'long', 'x']);
    const valCol = findColumn(['value', 'metric', 'intensity', 'power', 'capacity', 'temp', 'aqi', 'reading']) || columns.find(c => !['latitude', 'lat', 'lat_deg', 'y', 'longitude', 'lng', 'lon', 'long', 'x', 'name', 'title', 'location', 'station', 'site', 'city'].includes(c.toLowerCase()));
    const nameCol = findColumn(['name', 'title', 'location', 'station', 'site', 'city']);

    if (!latCol || !lngCol) {
      errors.push(
        `Missing required coordinates columns for Latitude/Longitude chart. Expected headers: 'latitude' and 'longitude'. Found: [${columns.join(', ')}]`
      );
    }

    if (errors.length > 0) {
      return { isValid: false, errors, parsedData: [], columns, detectedChartType: finalChartType };
    }

    rows.forEach((row, idx) => {
      const lineNum = idx + 2;
      const latVal = parseFloat(row[latCol]);
      const lngVal = parseFloat(row[lngCol]);
      const metricVal = valCol ? parseFloat(row[valCol]) : 1;
      const locationName = nameCol && row[nameCol] ? String(row[nameCol]).trim() : `Point ${idx + 1}`;

      if (isNaN(latVal) || latVal < -90 || latVal > 90) {
        errors.push(`Row ${lineNum}: Invalid latitude '${row[latCol]}'. Must be a number between -90 and 90.`);
      }
      if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
        errors.push(`Row ${lineNum}: Invalid longitude '${row[lngCol]}'. Must be a number between -180 and 180.`);
      }

      if (errors.length <= 10) {
        parsedData.push({
          latitude: latVal,
          longitude: lngVal,
          value: isNaN(metricVal) ? 0 : metricVal,
          name: locationName,
          ...row,
        });
      }
    });

  } else if (finalChartType === 'statewise') {
    const stateCol = findColumn(['state', 'state_name', 'state/ut', 'region', 'province']) || columns[0];
    const valCol = findColumn(['value', 'capacity', 'generation', 'consumption', 'aqi', 'metric', 'total']) || columns.find(c => c !== stateCol);

    if (!stateCol) {
      errors.push(`Missing state column for State-wise heatmap. Found: [${columns.join(', ')}]`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors, parsedData: [], columns, detectedChartType: finalChartType };
    }

    rows.forEach((row, idx) => {
      const lineNum = idx + 2;
      const rawState = row[stateCol];
      const normState = normalizeStateName(rawState);
      const metricVal = valCol ? parseFloat(row[valCol]) : 0;

      if (!normState) {
        errors.push(`Row ${lineNum}: Unrecognized Indian state name '${rawState}'.`);
      }

      if (errors.length <= 10) {
        parsedData.push({
          state: normState || rawState,
          originalState: rawState,
          value: isNaN(metricVal) ? 0 : metricVal,
          ...row,
        });
      }
    });

  } else if (['pie', 'doughnut'].includes(finalChartType)) {
    const labelCol = findColumn(['category', 'name', 'label', 'type', 'source', 'fuel', 'sector']) || columns[0];
    const valCol = findColumn(['value', 'percentage', 'percent', 'share', 'amount', 'val']) || columns.find(c => c !== labelCol);

    rows.forEach((row, idx) => {
      const lineNum = idx + 2;
      const label = row[labelCol] ? String(row[labelCol]).trim() : `Item ${idx + 1}`;
      const metricVal = valCol ? parseFloat(row[valCol]) : parseFloat(row[columns[1]] || 0);

      if (isNaN(metricVal)) {
        errors.push(`Row ${lineNum}: Invalid numeric value '${row[valCol]}' for category '${label}'.`);
      }

      if (errors.length <= 10) {
        parsedData.push({
          name: label,
          value: metricVal,
          ...row,
        });
      }
    });

  } else if (finalChartType === 'multiline' || finalChartType.startsWith('timeseries')) {
    const timeCol = findColumn(['date', 'year', 'time', 'timestamp', 'period', 'month']) || columns[0];

    rows.forEach((row, idx) => {
      const lineNum = idx + 2;
      const rawTime = row[timeCol];

      if (!rawTime || String(rawTime).trim() === '') {
        errors.push(`Row ${lineNum}: Empty date or year value.`);
      }

      const item = { date: String(rawTime).trim() };
      columns.forEach(col => {
        const numVal = parseFloat(row[col]);
        item[col] = isNaN(numVal) ? row[col] : numVal;
      });
      // Pick primary metric value if available
      item.value = typeof item[columns[1]] === 'number' ? item[columns[1]] : parseFloat(row.value || 0);

      if (errors.length <= 10) {
        parsedData.push(item);
      }
    });

  } else {
    // Default fallback parsing
    rows.forEach((row) => {
      parsedData.push(row);
    });
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors.slice(0, 15),
      parsedData: [],
      columns,
      detectedChartType: finalChartType,
    };
  }

  return {
    isValid: true,
    errors: [],
    parsedData,
    columns,
    detectedChartType: finalChartType,
  };
}

module.exports = {
  validateCSV,
  autoDetectChartType,
  normalizeStateName,
  INDIAN_STATES,
};
