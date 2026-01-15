import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, User, AlertCircle } from 'lucide-react';

// Updated Types - more flexible to handle different server responses
interface StoryResponse {
  id?: string; // Server returns 'id' field
  _id?: string | { $oid: string }; // Support legacy format
  user_id: string;
  title: string;
  file_path?: string;
  created_at: string | { $date: string }; // Support both formats
  updated_at: string | { $date: string }; // Support both formats
}

interface StoryData {
  id?: string; // Server returns 'id' field
  _id?: string | { $oid: string }; // Support legacy format
  user_id: string;
  title: string;
  text: string;
  chapters: [number, number][];
  paragraphs: [number, number][];
  entities: Array<{
    name: string;
    label: string;
    nicknames: string[];
    coref_position: [number, number][];
    description: Record<string, unknown>;
  }>;
  key_paragraphs: Array<Array<{ 
    index: number;
    start: number;
    end: number;
    entities: any[];
    summary: string;
    place: string[];
    time: string[];
  }>>;
  file_path?: string;
  created_at: string | { $date: string }; // Support both formats
  updated_at: string | { $date: string }; // Support both formats
}

const StoriesListPage: React.FC = () => {
  const [stories, setStories] = useState<StoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStoryId, setLoadingStoryId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to extract ID from different formats
  const extractId = (story: StoryResponse): string => {
    // Try 'id' field first (current server format)
    if (story.id && typeof story.id === 'string') {
      return story.id;
    }
    
    // Try '_id' field (legacy format)
    if (story._id) {
      if (typeof story._id === 'string') {
        return story._id;
      }
      if (typeof story._id === 'object' && story._id.$oid) {
        return story._id.$oid;
      }
    }
    
    return '';
  };

  // Helper function to extract date from different formats
  const extractDate = (date: string | { $date: string }): string => {
    if (typeof date === 'string') {
      return date;
    }
    if (date && typeof date === 'object' && date.$date) {
      return date.$date;
    }
    return new Date().toISOString(); // fallback
  };

  // Helper function to get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('comix_user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (err) {
      console.error('Failed to parse user data from localStorage:', err);
      return null;
    }
  };

  const getFromStorage = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return null;
    }
  };
  
  // Fetch user stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        
        const userData = getFromStorage('comix_user');
        
        if (!userData || !userData.token || !userData.token.access_token) {
          throw new Error('User not authenticated');
        }

        const response = await fetch('http://localhost:8000/stories/', {
          headers: {
            'Authorization': `Bearer ${userData.token.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('comix_user');
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StoryResponse[] = await response.json();
        
        // Debug: Log the actual data structure
        console.log('Received stories data:', data);
        
        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected array');
        }

        // Filter out invalid entries
        const validStories = data.filter(story => {
          const storyId = extractId(story);
          const hasValidId = storyId && storyId.length > 0;
          const hasTitle = story.title && typeof story.title === 'string';
          
          if (!hasValidId || !hasTitle) {
            console.warn('Skipping invalid story:', story);
            return false;
          }
          
          return true;
        });

        setStories(validStories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        if (err instanceof Error && err.message === 'User not authenticated') {
          navigate('/login');
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [navigate]);

  // Handle story click - fetch story details and navigate
  const handleStoryClick = async (storyId: string) => {
    try {
      setLoadingStoryId(storyId);
      
      const userData = getFromStorage('comix_user');

      if (!userData || !userData.token || !userData.token.access_token) {
        throw new Error('User not authenticated');
      }

      // Fetch detailed story data
      const response = await fetch(`http://localhost:8000/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${userData.token.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('comix_user');
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const storyData: StoryData = await response.json();
      
      // Navigate to story viewer page with the data
      navigate('/story', { state: { storyData } });
    } catch (err) {
      console.error('Error fetching story details:', err);
      if (err instanceof Error && err.message === 'User not authenticated') {
        navigate('/login');
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch story details');
    } finally {
      setLoadingStoryId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Error formatting date:', dateString, err);
      return 'תאריך לא תקין';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-600">load stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">error in story loading</h2>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn bg-primary-blue text-white hover:bg-primary-blue/90"
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-comic text-center mb-8">my stories</h1>
        
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-600 mb-2">you have no stories yet</h2>
            <p className="text-neutral-500 mb-6">create your first story to start</p>
            <button
              onClick={() => navigate('/generate')}
              className="btn bg-primary-blue text-white hover:bg-primary-blue/90"
            >
              create new story
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => {
              const storyId = extractId(story);
              const createdDate = extractDate(story.created_at);

              return (
                <motion.div
                  key={storyId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
                  onClick={() => handleStoryClick(storyId)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2 capitalize">
                        {story.title}
                      </h3>
                    </div>
                    <BookOpen className="text-primary-blue flex-shrink-0 ml-2" size={24} />
                  </div>

                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>created at: {formatDate(createdDate)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      {loadingStoryId === storyId ? (
                        <div className="flex items-center gap-2 text-sm text-primary-blue">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-blue"></div>
                          <span>loading...</span>
                        </div>
                      ) : (
                        <span className="text-sm text-primary-blue font-medium">
                          Click to view →
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {error && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="font-medium">error</span>
              </div>
              <p className="mt-1 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm underline hover:no-underline"
              >
                close
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default StoriesListPage;