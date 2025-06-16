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
                console.log('Signed in anonymously with Firebase Auth');
            })
            .catch((error) => {
                console.error('Anonymous sign-in error:', error);
            });
    } else {
        console.log('Firebase Auth user ID:', user.uid);
        window.firebaseUserId = user.uid;
    }
});

// Export for use in other modules
window.letitoutDb = db;
window.letitoutAuth = auth; 