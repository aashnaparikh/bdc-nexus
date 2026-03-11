// jest.setup.js — Polyfills and global mocks for jsdom test environment

// SAP UI5 Web Components rely on the Custom Elements API which jsdom does not fully support.
// Stub it out so component imports don't throw during test initialization.
if (typeof global.customElements === 'undefined') {
  global.customElements = {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn().mockResolvedValue(undefined)
  }
}

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

// jest-dom extends Jest's expect with DOM-specific matchers (toBeInTheDocument, etc.)
import '@testing-library/jest-dom'
