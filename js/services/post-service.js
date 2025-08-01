// Post Service for Firestore Operations
class PostService {
    constructor() {
        this.db = window.letitoutDb;
        this.collection = this.db.collection('letitout-posts');
        this.anonymousId = window.firebaseUserId;
    }

    // Verify authentication before operations
    async verifyAuth() {
        return new Promise((resolve, reject) => {
            const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                unsubscribe();
                if (user) {
                    window.firebaseUserId = user.uid;
                    resolve(user);
                } else {
                    reject(new Error('No authenticated user'));
                }
            });
        });
    }

    async createPost(content, emotion, city = null, isCustomCity = false) {
        try {
            // Try to ensure user is authenticated
            let userId;
            try {
                await this.verifyAuth();
                userId = window.firebaseUserId;
            } catch (authError) {
                console.warn('Authentication failed, using fallback user ID');
                // Use a fallback user ID if authentication fails
                userId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                window.firebaseUserId = userId;
            }

            if (!userId) {
                throw new Error('No user ID available');
            }

            // Get next truth number
            const truthNumber = await this.getNextTruthNumber();

            const post = {
                content: window.LetItOutUtils.sanitizeText(content),
                emotion,
                userId,
                localId: window.LocalIdManager.getId(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                feltCount: 0,
                city: city || null,
                customCity: !!isCustomCity,
                truthNumber: truthNumber
            };

            const docRef = await this.collection.add(post);
            return { id: docRef.id, ...post };
        } catch (error) {
            console.error('Error creating post:', error);
            // Show user-friendly error
            if (error.message.includes('permission')) {
                window.LetItOutUtils.showError('Authentication issue. Please refresh the page and try again.');
            } else {
                window.LetItOutUtils.showError('Unable to create post. Please try again.');
            }
            throw error;
        }
    }

    async getNextTruthNumber() {
        const counterRef = this.db.collection('counters').doc('posts');
        
        try {
            const result = await this.db.runTransaction(async (transaction) => {
                const counterDoc = await transaction.get(counterRef);
                
                if (!counterDoc.exists) {
                    // Initialize counter
                    transaction.set(counterRef, { count: 1 });
                    return 1;
                } else {
                    const newCount = counterDoc.data().count + 1;
                    transaction.update(counterRef, { count: newCount });
                    return newCount;
                }
            });
            
            return result;
        } catch (error) {
            console.error('Error getting next truth number:', error);
            throw error;
        }
    }

    async getPosts(limit = 20) {
        try {
            // Try to ensure user is authenticated for read operations
            try {
                await this.verifyAuth();
            } catch (authError) {
                console.warn('Authentication failed for getPosts, continuing with fallback');
                // Continue without authentication for read operations
            }
            
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
            // Don't show error for read operations, just log
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
        // Verify auth before subscribing
        this.verifyAuth().then(() => {
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
                    if (error.message.includes('permission')) {
                        console.error('Permission denied - check Firebase security rules');
                    }
                    window.LetItOutUtils.showError('Error loading posts. Please refresh the page.');
                });
        }).catch(error => {
            console.error('Authentication failed for subscription:', error);
            // Retry after a delay
            setTimeout(() => {
                this.subscribeToPosts(callback);
            }, 3000);
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
            console.log('addReply called with postId:', postId, 'reply:', reply);
            
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

            console.log('Processed replyData:', replyData);

            if (!replyData.content) {
                throw new Error('Reply content is empty.');
            }

            console.log('About to update Firestore document:', postId);
            console.log('Update data:', { replies: firebase.firestore.FieldValue.arrayUnion(replyData) });

            await this.collection.doc(postId).update({
                replies: firebase.firestore.FieldValue.arrayUnion(replyData)
            });

            console.log('Firestore update successful');
            return replyData;
        } catch (error) {
            console.error('Error adding reply:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
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

    // Migration function for existing posts
    async migrateExistingPosts() {
        try {
            console.log('Starting migration of existing posts...');
            
            const snapshot = await this.collection
                .where('truthNumber', '==', null)
                .orderBy('timestamp', 'asc')
                .get();
            
            if (snapshot.empty) {
                console.log('No posts need migration');
                return;
            }
            
            console.log(`Found ${snapshot.docs.length} posts to migrate`);
            
            let counter = 1;
            const batch = this.db.batch();
            
            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, { truthNumber: counter });
                counter++;
            });
            
            await batch.commit();
            console.log(`Successfully migrated ${counter - 1} existing posts`);
            
            // Update the counter to reflect the total count
            const counterRef = this.db.collection('counters').doc('posts');
            await counterRef.set({ count: counter - 1 });
            console.log('Updated counter to reflect migrated posts');
            
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    }
}

// Export for use in other modules
window.PostService = new PostService(); 