// src/utils/events.js
export const notifyProgressUpdate = () => {
  window.dispatchEvent(new Event('userProgressUpdated'));
};