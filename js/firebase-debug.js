// Firebase Debug Script
// This script helps diagnose Firebase authentication and permissions issues

class FirebaseDebugger {
    constructor() {
        this.debugInfo = {
            firebaseInitialized: false,
            authState: null,
            firestoreConnected: false,
            securityRules: 'unknown',
            lastError: null
        };
    }

    async runDiagnostics() {
        console.log('🔍 Running Firebase Diagnostics...');
        
        try {
            // Check Firebase initialization
            this.debugInfo.firebaseInitialized = !!window.firebase;
            console.log('✅ Firebase SDK loaded:', this.debugInfo.firebaseInitialized);
            
            // Check Firestore connection
            if (window.letitoutDb) {
                try {
                    // Try a simple read operation
                    const testDoc = await window.letitoutDb.collection('letitout-posts').limit(1).get();
                    this.debugInfo.firestoreConnected = true;
                    console.log('✅ Firestore connection successful');
                } catch (error) {
                    this.debugInfo.firestoreConnected = false;
                    this.debugInfo.lastError = error.message;
                    console.error('❌ Firestore connection failed:', error.message);
                }
            }
            
            // Check authentication state
            const auth = firebase.auth();
            const user = auth.currentUser;
            this.debugInfo.authState = user ? {
                uid: user.uid,
                isAnonymous: user.isAnonymous,
                emailVerified: user.emailVerified
            } : null;
            
            console.log('🔐 Authentication state:', this.debugInfo.authState);
            
            // Test write permission
            await this.testWritePermission();
            
            // Test read permission
            await this.testReadPermission();
            
            console.log('📊 Diagnostic Summary:', this.debugInfo);
            
        } catch (error) {
            console.error('❌ Diagnostic failed:', error);
        }
    }

    async testWritePermission() {
        try {
            console.log('🧪 Testing write permission...');
            const testPost = {
                content: 'Test post for diagnostics',
                emotion: 'Test',
                userId: 'test_user',
                localId: 'test_local',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                feltCount: 0,
                city: 'Test City',
                customCity: false
            };
            
            const docRef = await window.letitoutDb.collection('letitout-posts').add(testPost);
            console.log('✅ Write permission successful, test post ID:', docRef.id);
            
            // Clean up test post
            await docRef.delete();
            console.log('🧹 Test post cleaned up');
            
        } catch (error) {
            console.error('❌ Write permission failed:', error.message);
            this.debugInfo.lastError = error.message;
        }
    }

    async testReadPermission() {
        try {
            console.log('🧪 Testing read permission...');
            const snapshot = await window.letitoutDb.collection('letitout-posts').limit(1).get();
            console.log('✅ Read permission successful, found', snapshot.docs.length, 'documents');
        } catch (error) {
            console.error('❌ Read permission failed:', error.message);
            this.debugInfo.lastError = error.message;
        }
    }

    getRecommendations() {
        const recommendations = [];
        
        if (!this.debugInfo.firebaseInitialized) {
            recommendations.push('Firebase SDK not loaded - check script tags');
        }
        
        if (!this.debugInfo.firestoreConnected) {
            recommendations.push('Firestore connection failed - check security rules');
        }
        
        if (!this.debugInfo.authState) {
            recommendations.push('No authenticated user - check anonymous auth');
        }
        
        if (this.debugInfo.lastError && this.debugInfo.lastError.includes('permission')) {
            recommendations.push('Permission denied - update Firestore security rules to allow read/write');
        }
        
        return recommendations;
    }
}

// Auto-run diagnostics when script loads
document.addEventListener('DOMContentLoaded', () => {
    const firebaseDebugger = new FirebaseDebugger();
    setTimeout(() => {
        firebaseDebugger.runDiagnostics().then(() => {
            const recommendations = firebaseDebugger.getRecommendations();
            if (recommendations.length > 0) {
                console.log('💡 Recommendations:', recommendations);
            }
        });
    }, 2000); // Wait for Firebase to initialize
});

// Export for manual debugging
window.FirebaseDebugger = FirebaseDebugger; 