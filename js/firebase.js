// Initialize Firebase
firebase.initializeApp(window.firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Auth
const auth = firebase.auth();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support persistence.');
        }
    });

// Sign in anonymously with Firebase Auth
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        firebase.auth().signInAnonymously()
            .then(() => {
                if (window.DEBUG_MODE) console.log('Signed in anonymously with Firebase Auth');
            })
            .catch((error) => {
                console.error('Anonymous sign-in error:', error);
                // Retry authentication after a delay
                setTimeout(() => {
                    firebase.auth().signInAnonymously()
                        .then(() => {
                    if (window.DEBUG_MODE) console.log('Retry: Signed in anonymously');
                })
                        .catch((retryError) => console.error('Retry failed:', retryError));
                }, 2000);
            });
    } else {
        if (window.DEBUG_MODE) console.log('Firebase Auth user ID:', user.uid);
        window.firebaseUserId = user.uid;
        
        // Verify authentication is working
        if (window.DEBUG_MODE) console.log('Authentication verified:', {
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            emailVerified: user.emailVerified
        });
    }
});

// Export for use in other modules
window.letitoutDb = db;
window.letitoutAuth = auth; 