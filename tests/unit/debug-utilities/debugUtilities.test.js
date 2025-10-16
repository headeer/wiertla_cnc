// Unit tests for debug utilities

// Mock debug utility functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Log debug information
 * @param {string} message - Debug message
 * @param {*} data - Additional data to log
 */
const logDebug = (message, data = null) => {
  if (window.WiertlaCNC && window.WiertlaCNC.debug) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

/**
 * Log warning information
 * @param {string} message - Warning message
 * @param {*} data - Additional data to log
 */
const logWarning = (message, data = null) => {
  console.warn(`[WARNING] ${message}`, data);
};

/**
 * Log error information
 * @param {string} message - Error message
 * @param {*} data - Additional data to log
 */
const logError = (message, data = null) => {
  console.error(`[ERROR] ${message}`, data);
};

/**
 * Log performance information
 * @param {string} operation - Operation name
 * @param {number} startTime - Start time
 * @param {number} endTime - End time
 */
const logPerformance = (operation, startTime, endTime) => {
  const duration = endTime - startTime;
  console.log(`[PERFORMANCE] ${operation}: ${duration}ms`);
};

/**
 * Get performance metrics
 * @returns {Object} Performance metrics
 */
const getPerformanceMetrics = () => {
  if (!window.performance) return null;
  
  const navigation = window.performance.getEntriesByType('navigation')[0];
  const paint = window.performance.getEntriesByType('paint');
  
  return {
    loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
  };
};

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} name - Function name for logging
 * @returns {*} Function result
 */
const measureExecutionTime = (fn, name = 'function') => {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  logPerformance(name, startTime, endTime);
  return result;
};

/**
 * Create performance timer
 * @param {string} name - Timer name
 * @returns {Object} Timer object with start, end, and getDuration methods
 */
const createTimer = (name) => {
  let startTime = null;
  let endTime = null;
  
  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      endTime = performance.now();
      if (startTime) {
        logPerformance(name, startTime, endTime);
      }
    },
    getDuration: () => {
      if (startTime && endTime) {
        return endTime - startTime;
      }
      return null;
    }
  };
};

/**
 * Log memory usage
 */
const logMemoryUsage = () => {
  if (window.performance && window.performance.memory) {
    const memory = window.performance.memory;
    console.log('[MEMORY]', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
    });
  }
};

/**
 * Log network information
 */
const logNetworkInfo = () => {
  if (window.navigator && window.navigator.connection) {
    const connection = window.navigator.connection;
    console.log('[NETWORK]', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });
  }
};

/**
 * Log device information
 */
const logDeviceInfo = () => {
  if (window.navigator) {
    console.log('[DEVICE]', {
      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,
      language: window.navigator.language,
      cookieEnabled: window.navigator.cookieEnabled,
      onLine: window.navigator.onLine
    });
  }
};

/**
 * Log page information
 */
const logPageInfo = () => {
  if (window.location) {
    console.log('[PAGE]', {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer,
      title: document.title
    });
  }
};

/**
 * Log all debug information
 */
const logAllDebugInfo = () => {
  logPageInfo();
  logDeviceInfo();
  logNetworkInfo();
  logMemoryUsage();
  
  const metrics = getPerformanceMetrics();
  if (metrics) {
    console.log('[PERFORMANCE METRICS]', metrics);
  }
};

describe('Debug Utilities', () => {
  let consoleSpy;

  beforeEach(() => {
    // Restore console methods before spying
    jest.restoreAllMocks();
    
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {})
    };
    
    // Mock performance API
    window.performance = {
      now: jest.fn(() => Date.now()),
      getEntriesByType: jest.fn(() => []),
      memory: {
        usedJSHeapSize: 50 * 1024 * 1024,
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 200 * 1024 * 1024
      }
    };
    
    // Mock navigator
    window.navigator = {
      userAgent: 'Mozilla/5.0 (Test Browser)',
      platform: 'Test Platform',
      language: 'en-US',
      cookieEnabled: true,
      onLine: true,
      connection: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false
      }
    };
    
    // Mock location
    window.location = {
      href: 'https://test.com/page',
      pathname: '/page',
      search: '?test=1',
      hash: '#section'
    };
    
    // Mock document
    Object.defineProperty(document, 'referrer', {
      value: 'https://google.com',
      writable: true
    });
    document.title = 'Test Page';
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe('Logging Functions', () => {
    test('should log debug message when debug is enabled', () => {
      window.WiertlaCNC = { debug: true };
      logDebug('Test debug message', { data: 'test' });
      expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG] Test debug message', { data: 'test' });
    });

    test('should not log debug message when debug is disabled', () => {
      window.WiertlaCNC = { debug: false };
      logDebug('Test debug message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('should log warning message', () => {
      logWarning('Test warning message', { data: 'test' });
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARNING] Test warning message', { data: 'test' });
    });

    test('should log error message', () => {
      logError('Test error message', { data: 'test' });
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Test error message', { data: 'test' });
    });

    test('should log performance information', () => {
      logPerformance('Test operation', 1000, 1500);
      expect(consoleSpy.log).toHaveBeenCalledWith('[PERFORMANCE] Test operation: 500ms');
    });
  });

  describe('Performance Metrics', () => {
    test('should get performance metrics', () => {
      window.performance.getEntriesByType = jest.fn((type) => {
        if (type === 'navigation') {
          return [{
            loadEventEnd: 2000,
            loadEventStart: 1500,
            domContentLoadedEventEnd: 1200,
            domContentLoadedEventStart: 1000
          }];
        }
        if (type === 'paint') {
          return [
            { name: 'first-paint', startTime: 800 },
            { name: 'first-contentful-paint', startTime: 900 }
          ];
        }
        return [];
      });

      const metrics = getPerformanceMetrics();
      expect(metrics).toEqual({
        loadTime: 500,
        domContentLoaded: 200,
        firstPaint: 800,
        firstContentfulPaint: 900
      });
    });

    test('should return null when performance API is not available', () => {
      const originalPerformance = window.performance;
      delete window.performance;
      const metrics = getPerformanceMetrics();
      expect(metrics).toBeNull();
      window.performance = originalPerformance;
    });

    test('should handle missing navigation entries', () => {
      window.performance.getEntriesByType = jest.fn(() => []);
      const metrics = getPerformanceMetrics();
      expect(metrics).toEqual({
        loadTime: 0,
        domContentLoaded: 0,
        firstPaint: 0,
        firstContentfulPaint: 0
      });
    });
  });

  describe('Execution Time Measurement', () => {
    test('should measure function execution time', () => {
      const testFunction = () => {
        // Simulate some work
        return 'result';
      };
      
      const result = measureExecutionTime(testFunction, 'testFunction');
      expect(result).toBe('result');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[PERFORMANCE] testFunction:')
      );
    });

    test('should measure async function execution time', async () => {
      const asyncFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async result';
      };
      
      const result = await measureExecutionTime(asyncFunction, 'asyncFunction');
      expect(result).toBe('async result');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[PERFORMANCE] asyncFunction:')
      );
    });
  });

  describe('Timer', () => {
    test('should create and use timer', () => {
      const timer = createTimer('testTimer');
      
      timer.start();
      timer.end();
      
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[PERFORMANCE] testTimer:')
      );
    });

    test('should get timer duration', () => {
      const timer = createTimer('testTimer');
      
      timer.start();
      timer.end();
      
      const duration = timer.getDuration();
      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    test('should return null duration when timer not started', () => {
      const timer = createTimer('testTimer');
      const duration = timer.getDuration();
      expect(duration).toBeNull();
    });
  });

  describe('System Information Logging', () => {
    test('should log memory usage', () => {
      logMemoryUsage();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[MEMORY]',
        expect.objectContaining({
          used: expect.stringContaining('MB'),
          total: expect.stringContaining('MB'),
          limit: expect.stringContaining('MB')
        })
      );
    });

    test('should log network information', () => {
      // Ensure the connection object is available
      window.navigator.connection = {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false
      };
      
      logNetworkInfo();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[NETWORK]',
        expect.objectContaining({
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
          saveData: false
        })
      );
    });

    test('should log device information', () => {
      logDeviceInfo();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[DEVICE]',
        expect.objectContaining({
          userAgent: expect.any(String),
          platform: expect.any(String),
          language: expect.any(String),
          cookieEnabled: expect.any(Boolean),
          onLine: expect.any(Boolean)
        })
      );
    });

    test('should log page information', () => {
      logPageInfo();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[PAGE]',
        expect.objectContaining({
          url: 'https://test.com/page',
          pathname: '/page',
          search: '?test=1',
          hash: '#section',
          referrer: 'https://google.com',
          title: 'Test Page'
        })
      );
    });

    test('should log all debug information', () => {
      logAllDebugInfo();
      expect(consoleSpy.log).toHaveBeenCalledTimes(5); // Page, Device, Network, Memory, Performance
    });
  });

  describe('Error Handling', () => {
    test('should handle missing performance API gracefully', () => {
      window.performance = null;
      expect(() => {
        logMemoryUsage();
        getPerformanceMetrics();
      }).not.toThrow();
    });

    test('should handle missing navigator API gracefully', () => {
      window.navigator = null;
      expect(() => {
        logNetworkInfo();
        logDeviceInfo();
      }).not.toThrow();
    });

    test('should handle missing location API gracefully', () => {
      window.location = null;
      expect(() => {
        logPageInfo();
      }).not.toThrow();
    });
  });
});
