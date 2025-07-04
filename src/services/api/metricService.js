import metricData from '@/services/mockData/metrics.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metricService = {
  async getAll() {
    await delay(300);
    return [...metricData];
  },

  async getById(id) {
    await delay(200);
    const metric = metricData.find(metric => metric.Id === parseInt(id));
    if (!metric) {
      throw new Error('Metric not found');
    }
    return { ...metric };
  },

  async create(metricData) {
    await delay(500);
    const maxId = Math.max(...metricData.map(metric => metric.Id), 0);
    const newMetric = {
      Id: maxId + 1,
      ...metricData,
      timestamp: new Date().toISOString()
    };
    metricData.push(newMetric);
    return { ...newMetric };
  },

  async update(id, updates) {
    await delay(400);
    const index = metricData.findIndex(metric => metric.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Metric not found');
    }
    metricData[index] = { ...metricData[index], ...updates };
    return { ...metricData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = metricData.findIndex(metric => metric.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Metric not found');
    }
    const deletedMetric = metricData.splice(index, 1)[0];
    return { ...deletedMetric };
  }
};