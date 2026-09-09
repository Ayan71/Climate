// In-Memory Data Store Fallback for offline MongoDB environments
const memoryStore = {
  users: [],
  datasets: [],
  activityLogs: [],
  isMongoConnected: false,
};

module.exports = memoryStore;
