import { getMarketingData } from '../data/dataService.js'
import { CHANNELS } from '../data/constants.js'

test('getMarketingData resolves to the dataset', async () => {
  const data = await getMarketingData()
  expect(data.channels).toEqual(CHANNELS)
  expect(Array.isArray(data.rows)).toBe(true)
  expect(data.rows.length).toBeGreaterThan(0)
})
