'use client';

// Create a custom event for platform updates
export const PLATFORM_UPDATE_EVENT = 'platformUpdate';

// Function to dispatch the platform update event
export function dispatchPlatformUpdate() {
  window.dispatchEvent(new Event(PLATFORM_UPDATE_EVENT));
} 