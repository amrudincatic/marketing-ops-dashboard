import '@testing-library/jest-dom'

// jsdom lacks these browser APIs that Recharts and the count-up effect need.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver || ResizeObserverStub

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: true, // treat tests as reduced-motion so the count-up settles instantly
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  })
}

// Recharts ResponsiveContainer measures a 0x0 box in jsdom and warns; silence just that line.
const origWarn = console.warn
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('width(0) and height(0)')) return
  origWarn(...args)
}
