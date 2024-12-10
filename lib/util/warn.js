const prefix = '[Vue Router Tab]'

// Error
export function assert(condition, message) {
  if (!condition) {
    throw new Error(`${prefix} ${message}`)
  }
}

// Warn
export function warn(condition, message) {
  if (!condition) {
    typeof console !== 'undefined' && console.warn(`${prefix} ${message}`)
  }
}

// Common messages
export const messages = {
  renamed(newName, target = '方法') {
    return `该${target}已更名为“${newName}”，请修改后使用`
  }
}
