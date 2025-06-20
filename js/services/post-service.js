// Post Service for Firestore Operations
class PostService {
    constructor() {
        this.db = window.letitoutDb;
        this.collection = this.db.collection('letitout-posts');
        this.anonymousId = window.firebaseUserId;
    }

    async createPost(content, emotion, city = null, isCustomCity = false) {
        try {
            const userId = window.firebaseUserId;
            const post = {
                content: window.LetItOutUtils.sanitizeText(content),
                emotion,
                userId,
                localId: window.LocalIdManager.getId(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                feltCount: 0,
                city: city || null,
                customCity: !!isCustomCity
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

    async decrementFeltCount(postId) {
        try {
            const postRef = this.collection.doc(postId);
            await postRef.update({
                feltCount: firebase.firestore.FieldValue.increment(-1)
            });
        } catch (error) {
            console.error('Error decrementing felt count:', error);
            throw error;
        }
    }

    // Real-time updates
    subscribeToPosts(callback) {
        return this.collection
            .orderBy('timestamp', 'desc')
            .limit(100) // Increased limit for search/filter functionality
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

    async getPost(postId) {
        try {
            const doc = await this.collection.doc(postId).get();
            if (!doc.exists) {
                throw new Error('Post not found');
            }
            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            console.error('Error getting post:', error);
            throw error;
        }
    }

    async addReply(postId, reply) {
        try {
            const userReply = await this.getUserReply(postId);
            if (userReply) {
                throw new Error('You have already replied to this post');
            }

            const replyData = {
                content: (reply.replyText || reply.content || '').trim(),
                timestamp: new Date(),
                anonymousId: window.firebaseUserId,
                read: false
            };

            if (!replyData.content) {
                throw new Error('Reply content is empty.');
            }

            await this.collection.doc(postId).update({
                replies: firebase.firestore.FieldValue.arrayUnion(replyData)
            });

            return replyData;
        } catch (error) {
            console.error('Error adding reply:', error);
            throw error;
        }
    }

    async getUserReply(postId) {
        try {
            const post = await this.getPost(postId);
            if (!post.replies) return null;
            
            return post.replies.find(reply => reply.anonymousId === window.firebaseUserId);
        } catch (error) {
            console.error('Error getting user reply:', error);
            throw error;
        }
    }

    async markRepliesAsRead(postId) {
        try {
            const post = await this.getPost(postId);
            if (!post.replies) return;

            const updatedReplies = post.replies.map(reply => ({
                ...reply,
                viewed: true
            }));

            await this.collection.doc(postId).update({
                replies: updatedReplies
            });
        } catch (error) {
            console.error('Error marking replies as read:', error);
            throw error;
        }
    }

    /**
     * Fetch posts by localId (default) or userId (if type is 'userId').
     * @param {string} id - The id to match (localId or userId). Defaults to current localId.
     * @param {string} type - 'localId' (default) or 'userId'.
     */
    async getPostsByUser(id = window.LocalIdManager.getId(), type = 'localId') {
        try {
            const field = type === 'userId' ? 'userId' : 'localId';
            const snapshot = await this.collection
                .where(field, '==', id)
                .orderBy('timestamp', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user posts:', error);
            throw error;
        }
    }

    async getUnreadReplyCount() {
        try {
            const posts = await this.getPostsByUser();
            return posts.reduce((count, post) => {
                if (!post.replies) return count;
                return count + post.replies.filter(reply => !reply.viewed).length;
            }, 0);
        } catch (error) {
            console.error('Error getting unread reply count:', error);
            throw error;
        }
    }

    async upgradeToPremium() {
        try {
            // TODO: Implement Stripe subscription
            // This will be implemented when we add Stripe integration
            console.log('Implementing premium upgrade...');
        } catch (error) {
            console.error('Error upgrading to premium:', error);
            throw error;
        }
    }

    // Subscribe to user's posts for real-time badge updates
    subscribeToUserPosts(callback) {
        try {
            const localId = window.LocalIdManager.getId();
            return this.collection
                .where('localId', '==', localId)
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    const posts = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    callback(posts);
                }, error => {
                    console.error('Error in user posts subscription:', error);
                });
        } catch (error) {
            console.error('Error setting up user posts subscription:', error);
        }
    }

    async submitReport(post, reason) {
        try {
            const report = {
                // Report metadata
                reason: reason,
                reporterId: window.firebaseUserId,
                reportTimestamp: firebase.firestore.FieldValue.serverTimestamp(),

                // Snapshot of the reported post
                postId: post.id,
                postText: post.content || '',
                postEmotions: post.emotion || '',
                postCity: post.city || 'N/A',
                postFeltCount: post.feltCount || 0,
                postTimestamp: post.timestamp || null,
                postAuthorId: post.userId || 'unknown',
                postLocalId: post.localId || 'unknown'
            };
            await this.db.collection('reports').add(report);
        } catch (error) {
            console.error('Error submitting report:', error);
            throw error;
        }
    }
}

// Export for use in other modules
window.PostService = new PostService(); 