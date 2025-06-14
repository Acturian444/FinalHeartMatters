// Post Service for Firestore Operations
class PostService {
    constructor() {
        this.db = window.letitoutDb;
        this.collection = this.db.collection('letitout-posts');
    }

    async createPost(content, emotion) {
        try {
            const userId = window.LocalIdManager.getId();
            const post = {
                content: window.LetItOutUtils.sanitizeText(content),
                emotion,
                userId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                feltCount: 0,
                location: null // TODO: Add geolocation if needed
            };

            const docRef = await this.collection.add(post);
            return { id: docRef.id, ...post };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async getPosts(limit = 20) {
        try {
            const snapshot = await this.collection
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting posts:', error);
            throw error;
        }
    }

    async incrementFeltCount(postId) {
        try {
            const postRef = this.collection.doc(postId);
            await postRef.update({
                feltCount: firebase.firestore.FieldValue.increment(1)
            });
        } catch (error) {
            console.error('Error incrementing felt count:', error);
            throw error;
        }
    }

    // Real-time updates
    subscribeToPosts(callback) {
        return this.collection
            .orderBy('timestamp', 'desc')
            .limit(20)
            .onSnapshot(snapshot => {
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(posts);
            }, error => {
                console.error('Error in posts subscription:', error);
                window.LetItOutUtils.showError('Error loading posts. Please refresh the page.');
            });
    }
}

// Export for use in other modules
window.PostService = new PostService(); 