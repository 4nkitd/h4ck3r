// background.js - Service Worker for Manifest V3

// Listener for runtime messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "log") {
    console.log("Background Log:", message.data);
    sendResponse({ status: "logged" });
  }
});

// Example: Listener for scripting actions
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background service worker initialized.");
});