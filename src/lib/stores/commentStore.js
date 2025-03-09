// src/lib/stores/commentStore.js
import { writable } from 'svelte/store';

// Create the store with loading state
const createCommentStore = () => {
  // Add loading state to track initialization
  const { subscribe, update, set } = writable({
    comments: [],
    loading: false,
    error: null
  });

  return {
    subscribe,
    set,
    
    // Initialize store with data from API
    initialize: async () => {
      // Set loading state
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetch('/api');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        console.log( `Inside store results =>${JSON.stringify(response)}`);
        const comments = await response.json();
        
        // Update store with fetched data
        update(state => ({
          comments: comments.results,
          loading: false,
          error: null
        }));
        
        return comments.results;
      } catch (error) {
        console.error('Failed to initialize comment store:', error);
        
        // Update store with error
        update(state => ({
          ...state,
          loading: false,
          error: error.message
        }));
        
        return null;
      }
    },
    
    // Add a new comment
    addComment: (comment) => {
      update(state => ({
        ...state,
        comments: [...state.comments, comment]
      }));
    },
    
    // Increment likes for a comment
    incrementLike: async (id) => {
      let updatedComment;
      
      // Update in local store first (optimistic update)
      update(state => {
        console.log(`state input error when processing below function ${JSON.stringify(state)}`)
        const updatedComments = state.comments.map(comment => {
          if (comment.id === id) {
            updatedComment = { ...comment, likes: comment.likes + 1 };
            return updatedComment;
          }
          return comment;
        });
        
        return {
          ...state,
          comments: updatedComments
        };
      });
      
      // Call API to update database
      try {
        const response = await fetch(`/api/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to update like count');
        }
        
        return true;
      } catch (error) {
        console.error('API call failed:', error);
        
        // If API call fails, revert the change
        update(state => {
          const revertedComments = state.comments.map(comment => {
            if (comment.id === id) {
              return { ...comment, likes: comment.likes - 1 };
            }
            return comment;
          });
          
          return {
            ...state,
            comments: revertedComments
          };
        });
        
        return false;
      }
    }
  };
};

export const commentStore = createCommentStore();

// Auto-initialize the store if needed
// You can remove this if you prefer to initialize manually
if (typeof window !== 'undefined') {
  commentStore.initialize();
}