/**
 * Extension registry for future analytics domains.
 *
 * Phase 2+ modules (device, course, video, quiz, certificate, reports, ML)
 * can register here without modifying existing analytics APIs or services.
 */
const extensionModules = []

export const registerAnalyticsModule = (moduleDefinition) => {
  if (!moduleDefinition?.name || typeof moduleDefinition.getMetrics !== 'function') {
    throw new Error('Analytics module must define name and getMetrics()')
  }

  extensionModules.push(moduleDefinition)
}

export const getRegisteredAnalyticsModules = () => [...extensionModules]

export const clearAnalyticsModules = () => {
  extensionModules.length = 0
}
