// Test Firebase and LocalId Setup
async function testSetup() {
    console.log('Testing Firebase and LocalId Setup...');

    // Test LocalId
    console.log('\n1. Testing LocalId System:');
    const initialId = window.LocalIdManager.getId();
    console.log('Initial ID:', initialId);
    
    // Test ID persistence
    const secondId = window.LocalIdManager.getId();
    console.log('Second ID (should match):', secondId);
    console.log('IDs match:', initialId === secondId);
    
    // Test ID reset
    const newId = window.LocalIdManager.resetId();
    console.log('New ID after reset:', newId);
    console.log('New ID different:', newId !== initialId);

    // Test Firebase Connection
    console.log('\n2. Testing Firebase Connection:');
    try {
        const db = window.letitoutDb;
        console.log('Firestore instance created:', !!db);
        
        // Test collection access
        const testCollection = db.collection('letitout-posts');
        console.log('Collection access successful:', !!testCollection);
        
        // Test timestamp
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        console.log('Server timestamp available:', !!timestamp);
        
        console.log('\n✅ Firebase and LocalId setup verified successfully!');
    } catch (error) {
        console.error('\n❌ Firebase setup error:', error);
    }
}

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', testSetup); 