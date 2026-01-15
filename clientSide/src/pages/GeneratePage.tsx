import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { motion } from 'framer-motion';
import { FileUp, Download, Loader2 } from 'lucide-react';
// import { jsPDF } from 'jspdf';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; // ייבוא של useAuth

interface GenerateResponse {
  message: string;
  story: {
    _id?: string;
    user_id: string;
    title: string;
    text: string;
    chapters: any[];
    paragraphs: any[];
    entities: any[];
    key_paragraphs: any[][];
    file_path: string;
    created_at?: any;
    updated_at?: any;
  };
}

const getFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error parsing localStorage item:', error);
    return null;
  }
};

const GeneratePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const navigate = useNavigate();
  
  // const { user } = useAuth(); // קבלת המשתמש מהcontex
  const userData = getFromStorage('comix_user');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }
    setFile(uploadedFile);
    
    // רק אם לא הוכנסה כותרת מראש, השתמש בשם הקובץ
    if (!title.trim()) {
      setTitle(uploadedFile.name.replace(/\.pdf$/i, "")); // הסרת סיומת PDF
    }
    
    setError('');
  }, [title, file]); // הוספת title ו-file כתלות

  // פונקציה שתטפל בשינוי הכותרת
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // אם מחקו את הכותרת ויש קובץ, מלא מחדש בשם הקובץ
    if (!newTitle.trim() && file) {
      setTitle(file.name.replace(/\.pdf$/i, ""));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleGenerate = async () => {
    if (!file || !userData?.token) return;
  
    setIsLoading(true);
    setError('');
  
    const formData = new FormData();
    formData.append('file', file);
    
    // הוספת כותרת רק אם היא לא ריקה
    if (title && title.trim()) {
      formData.append('title', title.trim());
    }
  
    try {
      const res = await axios.post('http://localhost:8000/stories/upload-and-create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userData.token.access_token}` // שימוש בטוקן מהlocalStorage
        },
      });
  
      // שמירת הresponse במשתנה מקומי במקום להשתמש בstate
      const responseData = res.data;
      console.log('Response from server:', responseData);
      
      // עדכון הstate
      setResponse(responseData);

      // בדיקה שהנתונים קיימים לפני המעבר
      if (!responseData?.story) {
        throw new Error("Story data is missing from server response");
      }

      // השתמש ב-responseData במקום ב-response state
      setTimeout(() => {
        navigate('/story', {
          state: {
            storyData: {
              _id: responseData.story._id || responseData.story.user_id,
              user_id: responseData.story.user_id,
              title: responseData.story.title,
              text: responseData.story.text,
              chapters: responseData.story.chapters || [],
              paragraphs: responseData.story.paragraphs || [],
              entities: responseData.story.entities || [],
              key_paragraphs: responseData.story.key_paragraphs || [],
              file_path: responseData.story.file_path,
              created_at: responseData.story.created_at || { $date: new Date().toISOString() },
              updated_at: responseData.story.updated_at || { $date: new Date().toISOString() }
            }
          }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Error details:', err);
      if (axios.isAxiosError(err)) {
        console.error('Server response:', err.response?.data);
        setError(err.response?.data?.detail || 'Failed to generate story. Please try again.');
      } else {
        setError('Failed to generate story. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewStory = () => {
    if (!response?.story) return;
    
    navigate('/story', {
      state: {
        storyData: {
          _id: response.story._id || response.story.user_id,
          user_id: response.story.user_id,
          title: response.story.title,
          text: response.story.text,
          chapters: response.story.chapters || [],
          paragraphs: response.story.paragraphs || [],
          entities: response.story.entities || [],
          key_paragraphs: response.story.key_paragraphs || [],
          file_path: response.story.file_path,
          created_at: response.story.created_at || { $date: new Date().toISOString() },
          updated_at: response.story.updated_at || { $date: new Date().toISOString() }
        }
      }
    });
  };

  // פונקציה לקביעת הכותרת שתוצג
  const getDisplayTitle = () => {
    if (title.trim()) {
      return title;
    }
    if (file) {
      return file.name.replace(/\.pdf$/i, '');
    }
    return '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-comic text-center mb-8">Generate Your Comic</h1>

        {/* שדה כותרת */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Story Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-yellow focus:border-primary-yellow"
            placeholder="Enter story title (leave empty to use filename)..."
          />
          <p className="text-xs text-gray-500 mt-1">
            If left empty, the filename will be used as the story title
          </p>
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-yellow bg-yellow-50' : 'border-neutral-300 hover:border-primary-yellow'
          }`}
        >
          <input {...getInputProps()} />
          <FileUp className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <p className="text-lg mb-2">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
          </p>
          <p className="text-neutral-500">or click to select a PDF file</p>
          {file && (
            <div className="mt-4 text-success-DEFAULT">
              <div>Selected file: {file.name}</div>
              <div className="text-sm text-gray-600">
                {getDisplayTitle() ? `Story title: "${getDisplayTitle()}"` : 'No title set'}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-error-light text-error-dark rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!file || isLoading || !userData?.token}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating your story...
              </>
            ) : (
              'Create Story'
            )}
          </button>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-4 border-primary-yellow border-t-transparent rounded-full"
              />
            </div>
            <h2 className="text-2xl font-comic mb-2">Creating Magic...</h2>
            <p className="text-neutral-600">
              We're transforming your PDF into a stunning story. This might take a moment.
            </p>
          </motion.div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-comic mb-4">Your Story is Ready!</h3>
              <div className="space-y-2 mb-6">
                <p><strong>Title:</strong> {response.story?.title || 'Untitled Story'}</p>
                <p><strong>Status:</strong> {response.message}</p>
                <p><strong>Chapters:</strong> {response.story?.chapters?.length || 0}</p>
                <p><strong>Entities:</strong> {response.story?.entities?.length || 0}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleViewStory}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  View Story
                </button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                You will be redirected to view your story in a moment...
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneratePage;