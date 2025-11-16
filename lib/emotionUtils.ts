import { Emotion } from '@/types';
import { 
  Smile, 
  Heart, 
  Meh, 
  Frown, 
  AlertCircle, 
  Zap, 
  HelpCircle, 
  AlertTriangle,
  Laugh,
  Activity
} from 'lucide-react';

export const getEmotionColor = (emotion: Emotion): string => {
  const colorMap: Record<Emotion, string> = {
    'Joyful': '#10B981', // Green
    'Happy': '#10B981', // Green
    'Calm': '#2563EB', // Vibrant Blue
    'Neutral': '#6B7280', // Gray
    'Frustrated': '#FBBF24', // Yellow/Amber
    'Anxious': '#EF4444', // Red
    'Excited': '#EC4899', // Pink
    'Curious': '#8B5CF6', // Purple
    'Worried': '#F97316', // Orange
    'Stressed': '#DC2626', // Dark Red
  };
  
  return colorMap[emotion] || '#6B7280';
};

export const getEmotionIcon = (emotion: Emotion) => {
  const iconMap: Record<Emotion, typeof Smile> = {
    'Joyful': Laugh,
    'Happy': Smile,
    'Calm': Heart,
    'Neutral': Meh,
    'Frustrated': Frown,
    'Anxious': AlertCircle,
    'Excited': Zap,
    'Curious': HelpCircle,
    'Worried': AlertTriangle,
    'Stressed': Activity,
  };
  
  return iconMap[emotion] || Meh;
};

export const getEmotionLabel = (emotion: Emotion): string => {
  return emotion;
};

export const getEmotionBgColor = (emotion: Emotion): string => {
  const color = getEmotionColor(emotion);
  // Convert hex to rgba with low opacity
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

