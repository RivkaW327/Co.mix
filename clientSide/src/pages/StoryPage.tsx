import React from 'react';
import { useLocation } from 'react-router-dom';
import StoryViewer from '../components/StoryViewer';

// Mock story data for demonstration - replace with actual data from your API
const mockStoryData = {
  _id: { $oid: "507f1f77bcf86cd799439011" },
  user_id: "user123",
  title: "alice in wonderland",
  text: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do. Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it.

"And what is the use of a book," thought Alice, "without pictures or conversations?"

So she was considering in her own mind, as well as she could, for the hot day made her feel very sleepy and stupid, whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it.

The White Rabbit ran down a rabbit-hole under the hedge. In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.

Down, down, down. Would the fall never come to an end? "I wonder how many miles I've fallen by this time?" she said aloud. "I must be getting somewhere near the centre of the earth."`,
  chapters: [[0, 500], [500, 1000]],
  paragraphs: [[0, 200], [200, 400], [400, 600], [600, 800], [800, 1000]],
  entities: [
    {
      name: "Alice",
      label: "PERSON",
      nicknames: ["Alice"],
      coref_position: [[0, 5], [150, 155], [300, 305], [450, 455], [600, 605], [750, 755]],
      description: {}
    },
    {
      name: "White Rabbit",
      label: "PERSON",
      nicknames: ["Rabbit", "White Rabbit"],
      coref_position: [[400, 412], [500, 512], [650, 662], [800, 812]],
      description: {}
    },
    {
      name: "Sister",
      label: "PERSON",
      nicknames: ["her sister"],
      coref_position: [[50, 60], [120, 130]],
      description: {}
    }
  ],
  key_paragraphs: [[
    {
      index: 0,
      start: 0,
      end: 200,
      entities: [
        {
          name: "Alice",
          label: "PERSON",
          nicknames: ["Alice"],
          coref_position: [[0, 5]],
          description: {}
        }
      ],
      summary: "Alice gets bored sitting with her sister and contemplates the usefulness of books without pictures.",
      place: ["by the bank"],
      time: ["hot day"]
    },
    {
      index: 1,
      start: 400,
      end: 600,
      entities: [
        {
          name: "White Rabbit",
          label: "PERSON",
          nicknames: ["Rabbit", "White Rabbit"],
          coref_position: [[400, 412]],
          description: {}
        }
      ],
      summary: "A White Rabbit with a watch runs by, causing Alice to follow it down a rabbit hole.",
      place: ["rabbit-hole", "under the hedge"],
      time: ["Oh dear! I shall be late!"]
    },
    {
      index: 2,
      start: 800,
      end: 1000,
      entities: [
        {
          name: "Alice",
          label: "PERSON",
          nicknames: ["Alice"],
          coref_position: [[750, 755]],
          description: {}
        }
      ],
      summary: "Alice falls down the deep rabbit hole, wondering about the distance and destination.",
      place: ["deep well", "centre of the earth"],
      time: ["during the fall"]
    }
  ]],
  file_path: "/uploads/alice_in_wonderland.pdf",
  created_at: { $date: "2024-02-20T10:00:00Z" },
  updated_at: { $date: "2024-02-20T10:00:00Z" }
};

const StoryPage: React.FC = () => {
  const location = useLocation();
  
  // In a real app, you would get the story data from the location state or fetch it based on an ID
  // For now, we'll use mock data
  const storyData = location.state?.storyData || mockStoryData;

  return (
    <div className="min-h-screen bg-neutral-50">
      <StoryViewer story={storyData} />
    </div>
  );
};

export default StoryPage;