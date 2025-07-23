// Pre-Drop Overlay Testing Utility
// Run this in browser console to enable/disable the overlay for testing

// Enable testing override (hide overlay)
function enableOverride() {
    localStorage.setItem('drop_waitlist_override_enabled', 'true');
    console.log('✅ Override enabled - overlay will be hidden');
    location.reload();
}

// Disable testing override (show overlay)
function disableOverride() {
    localStorage.removeItem('drop_waitlist_override_enabled');
    console.log('❌ Override disabled - overlay will be shown');
    location.reload();
}

// Check current override status
function checkOverrideStatus() {
    const isEnabled = localStorage.getItem('drop_waitlist_override_enabled') === 'true';
    console.log(`Current override status: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
    return isEnabled;
}

// Show available commands
console.log(`
🛠️  Pre-Drop Overlay Testing Commands:

enableOverride()    - Hide overlay for testing
disableOverride()   - Show overlay normally
checkOverrideStatus() - Check current status

Usage: Run any command in this console
`);

// Auto-check status on load
checkOverrideStatus(); 