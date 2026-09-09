const User = require('../models/User');
const Dataset = require('../models/Dataset');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const seedSuperAdminAndData = async () => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    memoryStore.isMongoConnected = isMongo;

    const superAdminEmail = 'superadmin@vasudhaindia.org';

    // Hash password for memory store
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    let superAdminId = new mongoose.Types.ObjectId().toString();
    let sampleAdminId = new mongoose.Types.ObjectId().toString();

    let superAdminUser = null;
    let sampleAdminUser = null;

    if (isMongo) {
      superAdminUser = await User.findOne({ email: superAdminEmail });
      if (!superAdminUser) {
        superAdminUser = await User.create({
          name: 'Super Admin',
          email: superAdminEmail,
          password: 'Admin@123',
          role: 'superadmin',
          isActive: true,
        });
        console.log(`[Seed] Super Admin created in MongoDB: ${superAdminEmail}`);
      } else {
        console.log(`[Seed] Super Admin already exists: ${superAdminEmail}`);
      }
      superAdminId = superAdminUser._id.toString();

      sampleAdminUser = await User.findOne({ role: 'admin' });
      if (!sampleAdminUser) {
        sampleAdminUser = await User.create({
          name: 'Energy Data Admin',
          email: 'admin@vasudhaindia.org',
          password: 'Admin@123',
          role: 'admin',
          isActive: true,
        });
      }
      sampleAdminId = sampleAdminUser._id.toString();
    }

    const superAdminObj = {
      _id: superAdminId,
      id: superAdminId,
      name: 'Super Admin',
      email: superAdminEmail,
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
    };

    const sampleAdminObj = {
      _id: sampleAdminId,
      id: sampleAdminId,
      name: 'Energy Data Admin',
      email: 'admin@vasudhaindia.org',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
    };

    if (memoryStore.users.length === 0) {
      memoryStore.users.push(superAdminObj, sampleAdminObj);
    }

    // Generate valid 24-character ObjectIds for datasets
    const dsId1 = new mongoose.Types.ObjectId();
    const dsId2 = new mongoose.Types.ObjectId();
    const dsId3 = new mongoose.Types.ObjectId();
    const dsId4 = new mongoose.Types.ObjectId();
    const dsId5 = new mongoose.Types.ObjectId();
    const dsId6 = new mongoose.Types.ObjectId();
    const dsId7 = new mongoose.Types.ObjectId();

    const rawDatasets = [
      {
        _id: dsId1,
        title: 'India Heatwave & High Temperature Monitoring Stations 2025',
        description: 'Real-time telemetry stations tracking max summer temperatures (°C) across major urban and regional climate centers.',
        domain: 'Climate',
        chartType: 'latlng',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: superAdminId,
        order: 1,
        publishedAt: new Date(Date.now() - 6 * 86400000),
        columns: ['latitude', 'longitude', 'value', 'name', 'city'],
        parsedData: [
          { latitude: 28.6139, longitude: 77.2090, value: 46.2, name: 'Delhi Safdarjung Station', city: 'Delhi' },
          { latitude: 26.9124, longitude: 75.7873, value: 47.8, name: 'Jaipur IMD Observatory', city: 'Jaipur' },
          { latitude: 23.0225, longitude: 72.5714, value: 45.4, name: 'Ahmedabad Weather Station', city: 'Ahmedabad' },
          { latitude: 21.1458, longitude: 79.0882, value: 46.9, name: 'Nagpur Central Station', city: 'Nagpur' },
          { latitude: 17.3850, longitude: 78.4867, value: 42.1, name: 'Hyderabad Begumpet Station', city: 'Hyderabad' },
          { latitude: 13.0827, longitude: 80.2707, value: 41.5, name: 'Chennai Meenambakkam', city: 'Chennai' },
          { latitude: 22.5726, longitude: 88.3639, value: 40.8, name: 'Kolkata Alipore Station', city: 'Kolkata' },
          { latitude: 19.0760, longitude: 72.8777, value: 38.6, name: 'Mumbai Santacruz Station', city: 'Mumbai' },
          { latitude: 25.5941, longitude: 85.1376, value: 44.7, name: 'Patna Climate Observatory', city: 'Patna' },
          { latitude: 30.7333, longitude: 76.7794, value: 43.8, name: 'Chandigarh Weather Center', city: 'Chandigarh' },
        ],
        createdAt: new Date(Date.now() - 6 * 86400000),
      },
      {
        _id: dsId2,
        title: 'Installed Solar Power Capacity by Indian State (MW)',
        description: 'Total operational solar power capacity across Indian states as of 2025.',
        domain: 'Energy',
        chartType: 'statewise',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: sampleAdminId,
        order: 2,
        publishedAt: new Date(Date.now() - 5 * 86400000),
        columns: ['state', 'value'],
        parsedData: [
          { state: 'Rajasthan', value: 18700 },
          { state: 'Gujarat', value: 10400 },
          { state: 'Karnataka', value: 8900 },
          { state: 'Tamil Nadu', value: 7500 },
          { state: 'Maharashtra', value: 5200 },
          { state: 'Andhra Pradesh', value: 4500 },
          { state: 'Telangana', value: 4200 },
          { state: 'Madhya Pradesh', value: 3800 },
          { state: 'Uttar Pradesh', value: 2600 },
          { state: 'Punjab', value: 1850 },
          { state: 'Haryana', value: 1420 },
          { state: 'Kerala', value: 920 },
          { state: 'West Bengal', value: 680 },
          { state: 'Delhi', value: 340 },
        ],
        createdAt: new Date(Date.now() - 5 * 86400000),
      },
      {
        _id: dsId3,
        title: 'India Average Surface Temperature Anomaly Trend (1990 - 2025)',
        description: 'Decadal surface temperature variation (°C) relative to historical baselines.',
        domain: 'Climate',
        chartType: 'timeseries_line',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: superAdminId,
        order: 3,
        publishedAt: new Date(Date.now() - 4 * 86400000),
        columns: ['year', 'value'],
        parsedData: [
          { year: '1990', value: 0.15 },
          { year: '1993', value: 0.22 },
          { year: '1996', value: 0.18 },
          { year: '1999', value: 0.35 },
          { year: '2002', value: 0.48 },
          { year: '2005', value: 0.52 },
          { year: '2008', value: 0.45 },
          { year: '2011', value: 0.61 },
          { year: '2014', value: 0.74 },
          { year: '2017', value: 0.88 },
          { year: '2020', value: 0.96 },
          { year: '2023', value: 1.15 },
          { year: '2025', value: 1.28 },
        ],
        createdAt: new Date(Date.now() - 4 * 86400000),
      },
      {
        _id: dsId4,
        title: 'National Peak Electricity Demand vs Availability (GW)',
        description: 'Annual peak power demand vs peak power met across India power grids.',
        domain: 'Power',
        chartType: 'timeseries_bar',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: sampleAdminId,
        order: 4,
        publishedAt: new Date(Date.now() - 3 * 86400000),
        columns: ['year', 'value'],
        parsedData: [
          { year: '2018', value: 175.4 },
          { year: '2019', value: 182.5 },
          { year: '2020', value: 184.1 },
          { year: '2021', value: 200.5 },
          { year: '2022', value: 215.8 },
          { year: '2023', value: 240.0 },
          { year: '2024', value: 250.2 },
          { year: '2025', value: 262.8 },
        ],
        createdAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        _id: dsId5,
        title: 'Renewable Power Generation Growth (Terawatt-Hours)',
        description: 'Combined annual electricity production from Wind, Solar, and Small Hydro.',
        domain: 'Energy',
        chartType: 'timeseries_area',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: sampleAdminId,
        order: 5,
        publishedAt: new Date(Date.now() - 2 * 86400000),
        columns: ['year', 'value'],
        parsedData: [
          { year: '2015', value: 65.8 },
          { year: '2017', value: 102.3 },
          { year: '2019', value: 138.5 },
          { year: '2021', value: 171.2 },
          { year: '2023', value: 224.8 },
          { year: '2025', value: 289.4 },
        ],
        createdAt: new Date(Date.now() - 2 * 86400000),
      },
      {
        _id: dsId6,
        title: 'Per Capita Electricity Consumption by State (kWh)',
        description: 'Annual per capita electricity consumption index across states.',
        domain: 'Power',
        chartType: 'statewise',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: superAdminId,
        order: 6,
        publishedAt: new Date(Date.now() - 1 * 86400000),
        columns: ['state', 'value'],
        parsedData: [
          { state: 'Goa', value: 3120 },
          { state: 'Gujarat', value: 2380 },
          { state: 'Punjab', value: 2150 },
          { state: 'Haryana', value: 2080 },
          { state: 'Tamil Nadu', value: 1520 },
          { state: 'Maharashtra', value: 1450 },
          { state: 'Karnataka', value: 1390 },
          { state: 'Telangana', value: 1410 },
          { state: 'Rajasthan', value: 1250 },
          { state: 'Madhya Pradesh', value: 1080 },
          { state: 'Uttar Pradesh', value: 680 },
          { state: 'Bihar', value: 360 },
        ],
        createdAt: new Date(Date.now() - 1 * 86400000),
      },
      {
        _id: dsId7,
        title: 'Major National Power Grid Substation Locations',
        description: 'Key 765kV High Voltage Substation centers managed by Power Grid Corporation.',
        domain: 'Power',
        chartType: 'latlng',
        status: 'approved',
        approvalStatus: 'approved',
        uploadedBy: superAdminId,
        order: 7,
        publishedAt: new Date(),
        columns: ['latitude', 'longitude', 'value', 'name'],
        parsedData: [
          { latitude: 28.6353, longitude: 77.2250, value: 765, name: 'Northern Grid Regional HQ (Delhi)' },
          { latitude: 19.0825, longitude: 72.8811, value: 765, name: 'Western Grid Control Center (Mumbai)' },
          { latitude: 12.9716, longitude: 77.5946, value: 765, name: 'Southern Grid Dispatch Hub (Bengaluru)' },
          { latitude: 22.5726, longitude: 88.3639, value: 765, name: 'Eastern Grid Power Center (Kolkata)' },
          { latitude: 25.5788, longitude: 91.8933, value: 400, name: 'North-Eastern Grid Substation (Shillong)' },
          { latitude: 23.2599, longitude: 77.4126, value: 765, name: 'Central Power Corridor (Bhopal)' },
        ],
        createdAt: new Date(),
      },
    ];

    if (memoryStore.datasets.length === 0) {
      memoryStore.datasets = rawDatasets.map(d => ({
        ...d,
        id: d._id.toString(),
        uploadedBy: d.uploadedBy === superAdminId ? superAdminObj : sampleAdminObj,
      }));
    }

    if (isMongo) {
      const count = await Dataset.countDocuments();
      if (count === 0) {
        await Dataset.insertMany(rawDatasets);
        console.log(`[Seed] Successfully seeded ${rawDatasets.length} datasets into MongoDB.`);
      }
    }

    console.log(`[Seed] Data Store populated with ${memoryStore.datasets.length} datasets.`);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
  }
};

module.exports = seedSuperAdminAndData;
