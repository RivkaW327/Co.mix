import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, User, MapPin, Clock, BookOpen } from 'lucide-react';

interface Entity {
  name: string;
  label: string;
  nicknames: string[];
  coref_position: [number, number][];
  description: Record<string, unknown>;
}

interface KeyParagraph {
  index: number;
  start: number;
  end: number;
  entities: number[];
  summary: string;
  place: number[];
  time: number[];
}

interface StoryData {
  _id: { $oid: string };
  user_id: string;
  title: string;
  text: string;
  chapters: [number, number][];
  paragraphs: [number, number][];
  entities: Entity[];
  key_paragraphs: KeyParagraph[][];
  file_path: string;
  created_at: { $date: string };
  updated_at: { $date: string };
}

interface StoryViewerProps {
  story: StoryData;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  const [isCharactersExpanded, setIsCharactersExpanded] = useState(true);
  const [isKeyParagraphsExpanded, setIsKeyParagraphsExpanded] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Entity | null>(null);
  const [highlightedRanges, setHighlightedRanges] = useState<[number, number][] | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const scrollToPosition = (start: number, end: number) => {
    if (!textRef.current) return;
    
    // Set the range to highlight
    setHighlightedRanges([[start, end]]);
    
    // Use setTimeout to ensure the DOM has updated with the new highlights
    setTimeout(() => {
      const targetElement = textRef.current?.querySelector(`[data-range="${start}-${end}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCharacterClick = (entity: Entity) => {
    setSelectedCharacter(entity);
    setHighlightedRanges(entity.coref_position);
    
    // Scroll to the first occurrence of the character
    if (entity.coref_position[0] && textRef.current) {
      setTimeout(() => {
        const firstOccurrence = textRef.current?.querySelector(`[data-range="${entity.coref_position[0][0]}-${entity.coref_position[0][1]}"]`);
        if (firstOccurrence) {
          firstOccurrence.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const highlightText = (text: string, ranges: [number, number][] | null) => {
    if (!ranges || ranges.length === 0) return text;

    // Sort ranges by start position
    const sortedRanges = [...ranges].sort((a, b) => a[0] - b[0]);
    
    let result = [];
    let lastIndex = 0;

    sortedRanges.forEach(([start, end]) => {
      // Add text before the highlight
      if (start > lastIndex) {
        result.push(text.slice(lastIndex, start));
      }
      
      // Add highlighted text
      result.push(
        <span 
          key={`${start}-${end}`} 
          data-range={`${start}-${end}`}
          className="bg-blue-200 bg-opacity-50 px-1 rounded transition-colors duration-200 hover:bg-blue-300 hover:bg-opacity-60"
        >
          {text.slice(start, end)}
        </span>
      );
      
      lastIndex = Math.max(lastIndex, end);
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  const renderDescription = (description: Record<string, unknown>) => {
    if (!description || Object.keys(description).length === 0) return null;

    return (
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
        <div className="space-y-1">
          {Object.entries(description).map(([key, value]) => (
            <div key={key}>
              <span className="text-xs font-medium text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-xs text-gray-800 ml-2">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // const getEntityName = (entityIndex: number) => {
  //   return story.entities[entityIndex]?.name || `Entity ${entityIndex}`;
  // };

  const getPlaceEntities = (placeIndices: number[]) => {
    return placeIndices.map(index => story.entities[index]?.name || `Place ${index}`);
  };

  const getTimeEntities = (timeIndices: number[]) => {
    return timeIndices.map(index => story.entities[index]?.name || `Time ${index}`);
  };

  const getRegularEntities = (entityIndices: number[], placeIndices: number[], timeIndices: number[]) => {
    const placeAndTimeSet = new Set([...placeIndices, ...timeIndices]);
    return entityIndices.filter(index => !placeAndTimeSet.has(index)).map(i => story.entities[i]?.name || `Entity ${i}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">{story.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Characters Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="text-blue-600" />
                Characters
              </h2>
              <button
                onClick={() => setIsCharactersExpanded(!isCharactersExpanded)}
                className="text-gray-600 hover:text-gray-800"
              >
                {isCharactersExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {isCharactersExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {story.entities.map((entity, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedCharacter?.name === entity.name
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                        onClick={() => handleCharacterClick(entity)}
                      >
                        <h3 className="font-semibold">{entity.name}</h3>
                        {entity.label && (
                          <span className="text-sm text-gray-600">{entity.label}</span>
                        )}
                        {entity.nicknames && entity.nicknames.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Also known as:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entity.nicknames.map((nickname, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                                >
                                  {nickname}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          {entity.coref_position.length} occurrence{entity.coref_position.length !== 1 ? 's' : ''}
                        </div>
                        {renderDescription(entity.description)}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Key Paragraphs Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="text-green-600" />
                Key Paragraphs
              </h2>
              <button
                onClick={() => setIsKeyParagraphsExpanded(!isKeyParagraphsExpanded)}
                className="text-gray-600 hover:text-gray-800"
              >
                {isKeyParagraphsExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {isKeyParagraphsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                  {Array.isArray(story?.key_paragraphs?.[0]) &&
                  story.key_paragraphs[0].map((paragraph, index) => {
                    const regularEntities = getRegularEntities(paragraph.entities, paragraph.place, paragraph.time);
                    const placeEntities = getPlaceEntities(paragraph.place);
                    const timeEntities = getTimeEntities(paragraph.time);

                    return (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-green-200 transition-colors"
                        onClick={() => scrollToPosition(paragraph.start, paragraph.end)}
                      >
                        <p className="text-sm mb-2 font-medium">{paragraph.summary}</p>

                        {/* Places */}
                        {placeEntities.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <MapPin size={12} />
                            <span>{placeEntities.join(', ')}</span>
                          </div>
                        )}

                        {/* Times */}
                        {timeEntities.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <Clock size={12} />
                            <span>{timeEntities.join(', ')}</span>
                          </div>
                        )}

                        {/* Regular Characters */}
                        {regularEntities.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <User size={12} />
                            <span>{regularEntities.join(', ')}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Story Text</h2>
              <div className="flex items-center gap-4">
                {(selectedCharacter || highlightedRanges) && (
                  <button
                    onClick={() => {
                      setSelectedCharacter(null);
                      setHighlightedRanges(null);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Clear highlights
                  </button>
                )}
                <button
                  onClick={() => setIsTextExpanded(!isTextExpanded)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {isTextExpanded ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {isTextExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    ref={textRef}
                    className="prose max-w-none text-base leading-relaxed"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {highlightText(story.text, highlightedRanges)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;