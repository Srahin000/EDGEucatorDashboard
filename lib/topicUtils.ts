import { TopicCategory } from '@/types';
import { 
  Code, 
  Palette, 
  Activity, 
  GraduationCap, 
  Users, 
  Gamepad2,
  Home,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const getTopicCategory = (topic: string): TopicCategory => {
  const topicLower = topic.toLowerCase();
  
  if (['space', 'robots', 'coding', 'technology', 'engineering', 'science', 'math', 'stem', 'lego'].includes(topicLower)) {
    return 'STEM';
  }
  if (['art', 'painting', 'drawing', 'creativity', 'music', 'piano', 'dance'].includes(topicLower)) {
    return 'Art';
  }
  if (['sports', 'soccer', 'football', 'outdoor play', 'exercise'].includes(topicLower)) {
    return 'Sports';
  }
  if (['school', 'homework', 'test', 'project', 'class'].includes(topicLower)) {
    return 'School';
  }
  if (['friends', 'friend'].includes(topicLower)) {
    return 'Friends';
  }
  if (['games', 'gaming', 'video games', 'cartoons', 'tv'].includes(topicLower)) {
    return 'Games';
  }
  if (['family', 'parents', 'siblings'].includes(topicLower)) {
    return 'Family';
  }
  
  return 'Other';
};

export const getTopicColor = (category: TopicCategory): string => {
  const colorMap: Record<TopicCategory, string> = {
    'STEM': '#2563EB', // Vibrant Blue
    'Art': '#EC4899', // Pink
    'Sports': '#10B981', // Green
    'School': '#FBBF24', // Yellow/Amber
    'Friends': '#8B5CF6', // Purple
    'Games': '#F97316', // Orange
    'Family': '#06B6D4', // Cyan
    'Hobbies': '#6366F1', // Indigo
    'Other': '#6B7280', // Gray
  };
  
  return colorMap[category] || '#6B7280';
};

export const getTopicIcon = (category: TopicCategory) => {
  const iconMap: Record<TopicCategory, typeof Code> = {
    'STEM': Code,
    'Art': Palette,
    'Sports': Activity,
    'School': GraduationCap,
    'Friends': Users,
    'Games': Gamepad2,
    'Family': Home,
    'Hobbies': Sparkles,
    'Other': HelpCircle,
  };
  
  return iconMap[category] || HelpCircle;
};

export const getTopicBgColor = (category: TopicCategory): string => {
  const color = getTopicColor(category);
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

