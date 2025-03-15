// src/lib/stores/commentStore.js
import { writable, derived } from 'svelte/store';

const LIKED_ITEMS_KEY = 'syntax-snark-liked-items';

// Helper function to get previously liked items
const getLikedItems = () => {
  if (typeof window === 'undefined') return []; // SSR check
  
  const likedItems = localStorage.getItem(LIKED_ITEMS_KEY);
  return likedItems ? JSON.parse(likedItems) : [];
};

// Helper function to save liked items
const saveLikedItem = (id) => {
  if (typeof window === 'undefined') return; // SSR check
  
  const likedItems = getLikedItems();
  if (!likedItems.includes(id)) {
    likedItems.push(id);
    localStorage.setItem(LIKED_ITEMS_KEY, JSON.stringify(likedItems));
  }
};

// Helper function to sort comments by likes
const sortByLikes = (comments) => {
  return [...comments].sort((a, b) => b.likes - a.likes);
};

// Helper function to extract all unique categories from comments
const extractCategories = (comments) => {
  const categories = new Set();
  
  if (comments && comments.length > 0) {
    comments.forEach(comment => {
      if (comment.categories && Array.isArray(comment.categories)) {
        comment.categories.forEach(category => categories.add(category));
      }
    });
  }
  
  return ["All", ...Array.from(categories)].sort();
};

// Create the store with loading state
const createCommentStore = () => {
  // Add loading state to track initialization
  const { subscribe, update, set } = writable({
    comments: [],
    categories: ["All"],
    loading: false,
    error: null,
    likedItems: [] // Track liked items in the store too
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
        const {results} = await response.json();
        const likedItems = getLikedItems();

        // Sort the results by likes in descending order
        const sortedResults = sortByLikes(results);
        
        // Extract categories
        const categories = extractCategories(sortedResults);

        // Update store with fetched and sorted data
        update(state => ({
          comments: sortedResults,
          categories: categories,
          loading: false,
          error: null,
          likedItems: likedItems
        }));

        return sortedResults;
      } catch (error) {
        console.error('Failed to initialize comment store:', error);
        
        // Update store with error
        update(state => ({
          ...state,
          loading: false,
          error: error.message,
          likedItems: [],
        }));
        
        return null;
      }
    },
    
    // Add a new comment
    addComment: (comment) => {
      update(state => {
        // Add the comment then sort the array
        const updatedComments = sortByLikes([...state.comments, comment]);
        
        // Update categories
        const updatedCategories = extractCategories(updatedComments);
        
        return {
          ...state,
          comments: updatedComments,
          categories: updatedCategories
        };
      });
    },
    
    // Get all available categories
    getCategories: () => {
      let categories = ["All"];
      
      update(state => {
        categories = state.categories;
        return state;
      });
      
      return categories;
    },
    
    // Filter comments by category
    filterByCategory: (category) => {
      if (!category || category === "All") {
        return update(state => state);
      }
      
      return update(state => {
        const filteredComments = state.comments.filter(comment => 
          comment.categories && 
          Array.isArray(comment.categories) && 
          comment.categories.includes(category)
        );
        
        return {
          ...state,
          filteredComments
        };
      });
    },
    
    // Sort comments by likes (can be called manually if needed)
    sortComments: () => {
      update(state => ({
        ...state,
        comments: sortByLikes(state.comments)
      }));
    },
    
    // Increment likes for a comment
    incrementLike: async (id) => {
      console.log(`Update Likes for ${id}`);
      const likedItems = getLikedItems();

      if (likedItems.includes(id)) {
        // User already liked this comment
        update(state => ({
          ...state,
          error: "You've already liked this comment!"
        }));
        
        // Clear error after 3 seconds
        setTimeout(() => {
          update(state => ({ ...state, error: null }));
        }, 3000);
        
        return false;
      }

      let updatedComment;
      // Update in local store first (optimistic update)
      update(state => {
        console.log(`state input error when processing below function ${JSON.stringify(state)}`);
        const updatedComments = state.comments.map(comment => {
          if (comment.id === id) {
            updatedComment = { ...comment, likes: comment.likes + 1 };
            return updatedComment;
          }
          return comment;
        });
        
        // Sort the updated comments by likes
        const sortedComments = sortByLikes(updatedComments);
        
        return {
          ...state,
          comments: sortedComments
        };
      });
      
      // Call API to update database
      try {
        const response = await fetch(`/api/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to update like count');
        }
        // Save this item as liked
        saveLikedItem(id);
        
        // Update the liked items in the store
        update(state => ({
          ...state,
          likedItems: [...state.likedItems, id]
        }));
        
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
          
          // Re-sort after reverting
          const sortedComments = sortByLikes(revertedComments);
          
          return {
            ...state,
            comments: sortedComments
          };
        });
        
        return false;
      }
    },
    // Check if an item has been liked
    hasLiked: (id) => {
      return getLikedItems().includes(id);
    }
  };
};

export const commentStore = createCommentStore();

// Create a derived store that always gives the sorted comments
export const sortedComments = derived(
  commentStore,
  $store => sortByLikes($store.comments)
);

// Create a derived store for categories
export const categories = derived(
  commentStore,
  $store => $store.categories
);

// Auto-initialize the store if needed
// You can remove this if you prefer to initialize manually
if (typeof window !== 'undefined') {
  commentStore.initialize();
}