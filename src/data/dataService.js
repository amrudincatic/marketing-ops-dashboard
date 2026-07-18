import dataset from './mockData.json'

// Simulates an API call so the app reads as data-fetched rather than hardcoded.
export function getMarketingData({ delayMs = 350 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dataset), delayMs)
  })
}
