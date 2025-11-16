import { 
  Child, 
  Conversation, 
  TopicInsight, 
  DailySummary, 
  EmotionPoint, 
  Recommendation,
  Emotion,
  DateRange 
} from '@/types';

// Mock Children
export const mockChildren: Child[] = [
  {
    id: 'child1',
    name: 'Alex',
    age: 8,
    avatarColor: '#3B82F6', // Blue
  },
  {
    id: 'child2',
    name: 'Maya',
    age: 10,
    avatarColor: '#EC4899', // Pink
  },
  {
    id: 'child3',
    name: 'Sam',
    age: 7,
    avatarColor: '#10B981', // Green
  },
];

// Helper to generate dates - deterministic to avoid hydration mismatches
const getDateDaysAgo = (days: number, hourSeed: number = 10, minuteSeed: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  // Use deterministic values based on day to ensure server/client match
  const hour = (hourSeed % 12) + 8; // Between 8-19
  const minute = minuteSeed % 60;
  date.setHours(hour, minute, 0, 0);
  return date;
};

const getDateHoursAgo = (hours: number, minuteSeed: number = 0): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours, minuteSeed % 60, 0, 0);
  return date;
};

// Generate a full month of intricate conversations for Alex
const generateAlexConversations = (): Conversation[] => {
  const conversations: Conversation[] = [];
  let convId = 1;
  
  // Week 1: Space exploration begins, math anxiety, robotics interest
  const week1Conversations = [
    { day: 30, hour: 9, summary: 'Alex discovered a space documentary and is fascinated by rockets. Asked detailed questions about how rockets escape Earth\'s gravity. Showed excitement about the science project starting next week.', topics: ['Space', 'Rockets', 'Science', 'School'], emotion: 'Excited' as Emotion, phrases: ['How do rockets fly?', 'I want to learn everything about space!', 'This is so cool!'] },
    { day: 29, hour: 15, summary: 'After school, Alex talked about the math test coming up. Expressed worry about multiplication tables but also mentioned practicing with a friend. Mixed emotions about school.', topics: ['Math', 'School', 'Friends', 'Test'], emotion: 'Anxious' as Emotion, phrases: ['I\'m nervous about the test', 'My friend helps me study', 'Math is hard but I\'m trying'] },
    { day: 28, hour: 10, summary: 'Excitedly described the robotics club at school. Asked about building a robot that could explore Mars. Connected space interest with engineering.', topics: ['Robots', 'Space', 'Engineering', 'STEM', 'School'], emotion: 'Excited' as Emotion, phrases: ['Can robots go to Mars?', 'I want to build a space robot!', 'Engineering is awesome'] },
    { day: 27, hour: 14, summary: 'Frustrated with math homework. Said the problems were too hard. Mentioned drawing space scenes to calm down after homework.', topics: ['Math', 'Homework', 'Art', 'Frustration'], emotion: 'Frustrated' as Emotion, phrases: ['This homework is impossible', 'Drawing helps me feel better', 'I wish math was easier'] },
    { day: 26, hour: 16, summary: 'Played soccer with friends after school. Very energetic and happy. Talked about being the fastest runner on the team.', topics: ['Sports', 'Soccer', 'Friends', 'Exercise'], emotion: 'Joyful' as Emotion, phrases: ['Soccer is the best!', 'I\'m so fast!', 'My friends are awesome'] },
    { day: 25, hour: 11, summary: 'Reading a book about the solar system. Calm and focused. Asked about Pluto and why it\'s not a planet anymore.', topics: ['Reading', 'Space', 'Planets', 'Books', 'Science'], emotion: 'Curious' as Emotion, phrases: ['Why isn\'t Pluto a planet?', 'I love space books', 'The solar system is huge!'] },
    { day: 24, hour: 13, summary: 'Talked about the space project starting. Nervous but excited. Wants to build a model rocket but worried about the presentation.', topics: ['Space', 'School', 'Project', 'Presentation'], emotion: 'Anxious' as Emotion, phrases: ['I hope my project is good', 'What if I mess up?', 'But I\'m also excited'] },
  ];
  
  // Week 2: Space project deep dive, math improvement, coding interest emerges
  const week2Conversations = [
    { day: 23, hour: 9, summary: 'Started working on the space project. Very engaged. Researched different types of rockets and decided to focus on Mars missions.', topics: ['Space', 'Project', 'Mars', 'Research', 'School'], emotion: 'Excited' as Emotion, phrases: ['Mars missions are so cool!', 'I found amazing pictures', 'This project is fun'] },
    { day: 22, hour: 15, summary: 'Math test went better than expected! Relieved and proud. Said the practice with friend really helped. Confidence building.', topics: ['Math', 'Test', 'Friends', 'Success'], emotion: 'Happy' as Emotion, phrases: ['I did better than I thought!', 'Practice really helps', 'I\'m getting better at math'] },
    { day: 21, hour: 10, summary: 'Discovered coding games online. Fascinated by how games are programmed. Asked about learning to code. New interest emerging.', topics: ['Coding', 'Games', 'Technology', 'Learning'], emotion: 'Curious' as Emotion, phrases: ['How do games work?', 'Can I learn to code?', 'This is interesting'] },
    { day: 20, hour: 14, summary: 'Working on space project with a classmate. Collaborative and happy. They\'re building a model together.', topics: ['Space', 'Project', 'Friends', 'Collaboration', 'Building'], emotion: 'Joyful' as Emotion, phrases: ['Working together is fun', 'Our model looks great', 'Teamwork is cool'] },
    { day: 19, hour: 16, summary: 'Played video games after homework. Talked about favorite space-themed games. Connected gaming with space interest.', topics: ['Games', 'Space', 'Entertainment', 'Technology'], emotion: 'Happy' as Emotion, phrases: ['Space games are the best', 'I love space themes', 'Games are fun'] },
    { day: 18, hour: 11, summary: 'Struggled with a coding tutorial. Frustrated but determined. Said it\'s hard but wants to keep trying.', topics: ['Coding', 'Learning', 'Challenge', 'Technology'], emotion: 'Frustrated' as Emotion, phrases: ['This is really hard', 'But I won\'t give up', 'I\'ll figure it out'] },
    { day: 17, hour: 13, summary: 'Space project presentation day. Nervous before, excited after. Presentation went well and got positive feedback.', topics: ['Space', 'Presentation', 'School', 'Success'], emotion: 'Excited' as Emotion, phrases: ['I was so nervous!', 'But it went great!', 'Everyone liked my project'] },
  ];
  
  // Week 3: Coding deep dive, LEGO robotics, math confidence grows
  const week3Conversations = [
    { day: 16, hour: 9, summary: 'Made progress with coding! Created a simple animation. Very proud and excited. Wants to make a space-themed game.', topics: ['Coding', 'Technology', 'Success', 'Games', 'Space'], emotion: 'Excited' as Emotion, phrases: ['I made something!', 'Coding is fun now', 'I want to make a game'] },
    { day: 15, hour: 15, summary: 'Joined LEGO robotics club. Built a simple robot. Very engaged and happy. Connected building with coding interest.', topics: ['LEGO', 'Robots', 'Building', 'STEM', 'Club'], emotion: 'Joyful' as Emotion, phrases: ['I built a robot!', 'LEGO is awesome', 'Robotics is cool'] },
    { day: 14, hour: 10, summary: 'Math class is getting easier. Confidence growing. Helped a friend with math homework. Feeling capable.', topics: ['Math', 'School', 'Friends', 'Confidence', 'Helping'], emotion: 'Happy' as Emotion, phrases: ['Math isn\'t so bad now', 'I can help others', 'I\'m getting smarter'] },
    { day: 13, hour: 14, summary: 'Working on coding project - a simple space game. Very focused and determined. Spent hours on it.', topics: ['Coding', 'Games', 'Space', 'Project', 'Focus'], emotion: 'Calm' as Emotion, phrases: ['I\'m making a game', 'This takes time', 'I love coding'] },
    { day: 12, hour: 16, summary: 'Soccer practice was intense. Very energetic. Talked about improving skills and being team captain next year.', topics: ['Sports', 'Soccer', 'Goals', 'Team'], emotion: 'Excited' as Emotion, phrases: ['I want to be captain', 'I\'m getting better', 'Soccer is great'] },
    { day: 11, hour: 11, summary: 'Read about astronauts and space missions. Very curious. Asked about becoming an astronaut. Long-term interest developing.', topics: ['Space', 'Astronauts', 'Career', 'Reading', 'Future'], emotion: 'Curious' as Emotion, phrases: ['Can I be an astronaut?', 'Space is amazing', 'I want to explore space'] },
    { day: 10, hour: 13, summary: 'LEGO robot didn\'t work as expected. Frustrated but learned from mistake. Determined to fix it.', topics: ['LEGO', 'Robots', 'Problem-Solving', 'Learning'], emotion: 'Frustrated' as Emotion, phrases: ['It didn\'t work', 'But I learned something', 'I\'ll fix it'] },
  ];
  
  // Week 4: Advanced topics, integration of interests, emotional maturity
  const week4Conversations = [
    { day: 9, hour: 9, summary: 'Fixed the LEGO robot! Very proud. Explained how debugging works. Showing problem-solving skills.', topics: ['LEGO', 'Robots', 'Problem-Solving', 'Success', 'Debugging'], emotion: 'Happy' as Emotion, phrases: ['I fixed it!', 'Debugging is important', 'I solved the problem'] },
    { day: 8, hour: 15, summary: 'Coding game is coming along. Added space theme elements. Very creative and engaged. Combining multiple interests.', topics: ['Coding', 'Games', 'Space', 'Creativity', 'Technology'], emotion: 'Excited' as Emotion, phrases: ['My game has rockets!', 'I\'m combining interests', 'This is so fun'] },
    { day: 7, hour: 10, summary: 'Math test results came back - did really well! Confidence boost. No longer anxious about math.', topics: ['Math', 'Test', 'Success', 'Confidence'], emotion: 'Joyful' as Emotion, phrases: ['I got a good grade!', 'Math isn\'t scary', 'I can do this'] },
    { day: 6, hour: 14, summary: 'Presented coding game to class. Nervous but excited. Got great feedback. Pride in work.', topics: ['Coding', 'Games', 'Presentation', 'School', 'Success'], emotion: 'Excited' as Emotion, phrases: ['Everyone liked my game', 'I\'m proud of it', 'Sharing is fun'] },
    { day: 5, hour: 16, summary: 'Soccer game - team won! Very happy. Talked about teamwork and strategy. Leadership emerging.', topics: ['Sports', 'Soccer', 'Team', 'Success', 'Leadership'], emotion: 'Joyful' as Emotion, phrases: ['We won!', 'Teamwork matters', 'I helped the team'] },
    { day: 4, hour: 11, summary: 'Reading advanced space book. Understanding more complex concepts. Curiosity deepening.', topics: ['Reading', 'Space', 'Learning', 'Books', 'Science'], emotion: 'Curious' as Emotion, phrases: ['This book is advanced', 'I understand more now', 'Space is fascinating'] },
    { day: 3, hour: 13, summary: 'Helping younger student with coding. Teaching and explaining. Showing empathy and patience.', topics: ['Coding', 'Teaching', 'Helping', 'Friends', 'Empathy'], emotion: 'Calm' as Emotion, phrases: ['I\'m helping someone', 'Teaching is fun', 'I like helping others'] },
    { day: 2, hour: 9, summary: 'Planning next coding project - a space exploration simulator. Very ambitious. Long-term thinking.', topics: ['Coding', 'Space', 'Planning', 'Future', 'Projects'], emotion: 'Excited' as Emotion, phrases: ['My next project will be big', 'I have ideas', 'I\'m planning ahead'] },
    { day: 1, hour: 15, summary: 'Reflected on the month. Proud of progress in coding, math, and space knowledge. Confidence grown significantly.', topics: ['Reflection', 'Progress', 'Growth', 'Confidence'], emotion: 'Happy' as Emotion, phrases: ['I learned so much', 'I\'m proud of myself', 'I can do hard things'] },
    { day: 0, hour: 10, summary: 'Today: Excited about new robotics challenge. Starting a group project. Leadership and collaboration skills developing.', topics: ['Robots', 'Collaboration', 'Leadership', 'STEM', 'Projects'], emotion: 'Excited' as Emotion, phrases: ['New challenge!', 'Working with others', 'I\'m ready'] },
  ];
  
  // Combine all conversations
  const allAlexConvs = [...week1Conversations, ...week2Conversations, ...week3Conversations, ...week4Conversations];
  
  allAlexConvs.forEach(conv => {
    conversations.push({
      id: `alex-${convId++}`,
      childId: 'child1',
      timestamp: getDateDaysAgo(conv.day, conv.hour, 0),
      summary: conv.summary,
      topics: conv.topics,
      dominantEmotion: conv.emotion,
      highlightPhrases: conv.phrases,
    });
  });
  
  return conversations;
};

// Generate a full month of intricate conversations for Maya
const generateMayaConversations = (): Conversation[] => {
  const conversations: Conversation[] = [];
  let convId = 1;
  
  // Week 1: Art exploration, dance preparation, school stress
  const week1Conversations = [
    { day: 30, hour: 10, summary: 'Started a new painting in art class. Very focused and happy. Experimenting with watercolors for the first time.', topics: ['Art', 'Painting', 'School', 'Creativity'], emotion: 'Joyful' as Emotion, phrases: ['Watercolors are beautiful', 'I love painting', 'Art makes me happy'] },
    { day: 29, hour: 15, summary: 'Dance recital coming up in two weeks. Excited but also nervous. Practicing every day after school.', topics: ['Dance', 'Performance', 'Recital', 'Practice'], emotion: 'Excited' as Emotion, phrases: ['The recital is soon', 'I practice every day', 'I\'m excited but nervous'] },
    { day: 28, hour: 14, summary: 'Feeling overwhelmed with school projects. Multiple assignments due. Stressed but managing with help from friends.', topics: ['School', 'Homework', 'Stress', 'Friends'], emotion: 'Stressed' as Emotion, phrases: ['I have so much work', 'My friends help me', 'I\'ll get through this'] },
    { day: 27, hour: 11, summary: 'Nature walk with family. Very calm and peaceful. Observed birds and asked questions about their behavior.', topics: ['Nature', 'Animals', 'Family', 'Biology'], emotion: 'Calm' as Emotion, phrases: ['Nature is peaceful', 'Birds are interesting', 'I love being outside'] },
    { day: 26, hour: 16, summary: 'Piano practice went well. Learned a new piece. Music is calming and brings joy.', topics: ['Music', 'Piano', 'Practice', 'Arts'], emotion: 'Happy' as Emotion, phrases: ['I learned a new song', 'Piano is relaxing', 'Music is wonderful'] },
    { day: 25, hour: 13, summary: 'Art teacher praised her painting. Confidence boost. Wants to enter art contest.', topics: ['Art', 'Painting', 'Success', 'Confidence', 'School'], emotion: 'Joyful' as Emotion, phrases: ['My teacher liked it!', 'I might enter a contest', 'I\'m getting better'] },
    { day: 24, hour: 9, summary: 'Dance practice - struggling with a difficult move. Frustrated but determined. Won\'t give up.', topics: ['Dance', 'Practice', 'Challenge', 'Determination'], emotion: 'Frustrated' as Emotion, phrases: ['This move is hard', 'But I\'ll keep trying', 'I won\'t quit'] },
  ];
  
  // Week 2: Art contest entry, dance improvement, biology interest
  const week2Conversations = [
    { day: 23, hour: 10, summary: 'Finished painting for art contest. Very proud. Used techniques learned in class. Creative expression flowing.', topics: ['Art', 'Painting', 'Contest', 'Creativity', 'Success'], emotion: 'Happy' as Emotion, phrases: ['My painting is done', 'I used new techniques', 'I\'m proud of it'] },
    { day: 22, hour: 15, summary: 'Dance move finally clicked! Breakthrough moment. Very excited and relieved. Practice paying off.', topics: ['Dance', 'Success', 'Practice', 'Breakthrough'], emotion: 'Excited' as Emotion, phrases: ['I did it!', 'Practice really works', 'I\'m so happy'] },
    { day: 21, hour: 14, summary: 'School project on ecosystems. Very engaged. Researching different habitats. Biology interest deepening.', topics: ['School', 'Biology', 'Nature', 'Research', 'Learning'], emotion: 'Curious' as Emotion, phrases: ['Ecosystems are fascinating', 'I love learning', 'Biology is cool'] },
    { day: 20, hour: 11, summary: 'Piano recital piece chosen. Nervous about performing. But also excited to share music.', topics: ['Music', 'Piano', 'Performance', 'Recital'], emotion: 'Anxious' as Emotion, phrases: ['I\'m nervous to perform', 'But I\'m also excited', 'Music is meant to be shared'] },
    { day: 19, hour: 16, summary: 'Art contest results - won second place! Very proud. Recognition for hard work.', topics: ['Art', 'Contest', 'Success', 'Recognition'], emotion: 'Joyful' as Emotion, phrases: ['I won second place!', 'All my work paid off', 'I\'m so happy'] },
    { day: 18, hour: 13, summary: 'Dance practice with team. Collaborative and happy. Teamwork making the performance better.', topics: ['Dance', 'Team', 'Collaboration', 'Performance'], emotion: 'Joyful' as Emotion, phrases: ['We work well together', 'Team practice is fun', 'Our dance is getting better'] },
    { day: 17, hour: 9, summary: 'Biology class - learning about plants. Very curious. Wants to start a garden at home.', topics: ['Biology', 'Nature', 'Plants', 'Learning', 'Gardening'], emotion: 'Curious' as Emotion, phrases: ['Plants are amazing', 'I want a garden', 'Biology is interesting'] },
  ];
  
  // Week 3: Dance recital week, art portfolio, music confidence
  const week3Conversations = [
    { day: 16, hour: 15, summary: 'Dance recital is this weekend! Final rehearsals. Nervous excitement building. Ready to perform.', topics: ['Dance', 'Recital', 'Performance', 'Nerves'], emotion: 'Anxious' as Emotion, phrases: ['The recital is this weekend!', 'I\'m nervous but ready', 'I\'ve practiced so much'] },
    { day: 15, hour: 10, summary: 'Creating art portfolio for school. Reflecting on growth. Seeing improvement over time.', topics: ['Art', 'Portfolio', 'Reflection', 'Growth', 'School'], emotion: 'Calm' as Emotion, phrases: ['I\'ve improved so much', 'My portfolio looks good', 'I can see my progress'] },
    { day: 14, hour: 14, summary: 'Piano practice - piece is coming together. Confidence growing. Less nervous about recital.', topics: ['Music', 'Piano', 'Practice', 'Confidence'], emotion: 'Happy' as Emotion, phrases: ['I\'m getting better', 'I feel more confident', 'Practice helps'] },
    { day: 13, hour: 11, summary: 'Dance recital day! Performed well. Very proud and relieved. All the practice was worth it.', topics: ['Dance', 'Recital', 'Performance', 'Success'], emotion: 'Excited' as Emotion, phrases: ['I did it!', 'The recital went great', 'I\'m so proud'] },
    { day: 12, hour: 16, summary: 'Started planning garden project. Researching what plants to grow. Combining biology interest with hands-on activity.', topics: ['Gardening', 'Biology', 'Nature', 'Projects', 'Planning'], emotion: 'Curious' as Emotion, phrases: ['I\'m planning my garden', 'I want to grow vegetables', 'This will be fun'] },
    { day: 11, hour: 13, summary: 'Art class - trying sculpture for first time. New medium, new challenges. Excited to learn.', topics: ['Art', 'Sculpture', 'Learning', 'Creativity', 'School'], emotion: 'Curious' as Emotion, phrases: ['Sculpture is different', 'I want to try new things', 'Learning is fun'] },
    { day: 10, hour: 9, summary: 'Piano recital went well! Performed confidently. Music brings so much joy.', topics: ['Music', 'Piano', 'Recital', 'Success', 'Performance'], emotion: 'Joyful' as Emotion, phrases: ['I performed well!', 'Music makes me happy', 'I love playing piano'] },
  ];
  
  // Week 4: Advanced art, garden project, emotional maturity
  const week4Conversations = [
    { day: 9, hour: 10, summary: 'Working on advanced painting techniques. Teacher says she\'s ready for more challenging projects. Growth recognized.', topics: ['Art', 'Painting', 'Growth', 'Learning', 'School'], emotion: 'Happy' as Emotion, phrases: ['I\'m ready for harder projects', 'I\'ve grown so much', 'I love challenges'] },
    { day: 8, hour: 15, summary: 'Garden project started! Planted first seeds. Very excited. Connecting biology learning with real experience.', topics: ['Gardening', 'Biology', 'Projects', 'Nature', 'Hands-on'], emotion: 'Excited' as Emotion, phrases: ['I planted seeds!', 'I can\'t wait for them to grow', 'This is so cool'] },
    { day: 7, hour: 14, summary: 'Helping friend with art project. Teaching and sharing knowledge. Empathy and collaboration.', topics: ['Art', 'Teaching', 'Friends', 'Helping', 'Collaboration'], emotion: 'Calm' as Emotion, phrases: ['I\'m helping my friend', 'Teaching is rewarding', 'Sharing knowledge is good'] },
    { day: 6, hour: 11, summary: 'Dance team planning next performance. Leadership role emerging. Organizing and coordinating.', topics: ['Dance', 'Leadership', 'Team', 'Planning', 'Performance'], emotion: 'Excited' as Emotion, phrases: ['I\'m helping plan', 'Leadership is fun', 'I like organizing'] },
    { day: 5, hour: 16, summary: 'Biology project on plant growth. Documenting garden progress. Scientific observation skills developing.', topics: ['Biology', 'Gardening', 'Science', 'Observation', 'School'], emotion: 'Curious' as Emotion, phrases: ['I\'m observing my plants', 'Science is everywhere', 'I love documenting'] },
    { day: 4, hour: 13, summary: 'Art portfolio review - significant improvement noted. Proud of artistic journey. Confidence in abilities.', topics: ['Art', 'Portfolio', 'Growth', 'Confidence', 'Reflection'], emotion: 'Happy' as Emotion, phrases: ['I\'ve improved so much', 'I\'m proud of my art', 'I can see my growth'] },
    { day: 3, hour: 9, summary: 'Music composition - creating original piece. Very creative and engaged. Combining multiple artistic interests.', topics: ['Music', 'Composition', 'Creativity', 'Arts'], emotion: 'Excited' as Emotion, phrases: ['I\'m creating my own music', 'This is creative', 'I love making art'] },
    { day: 2, hour: 15, summary: 'Garden showing first sprouts! Very excited. Biology learning coming to life. Patience and care paying off.', topics: ['Gardening', 'Biology', 'Success', 'Nature', 'Growth'], emotion: 'Joyful' as Emotion, phrases: ['My plants are growing!', 'I can see progress', 'This is amazing'] },
    { day: 1, hour: 10, summary: 'Reflected on month of growth. Proud of progress in art, dance, music, and biology. Well-rounded development.', topics: ['Reflection', 'Growth', 'Progress', 'Multiple Interests'], emotion: 'Happy' as Emotion, phrases: ['I\'ve grown so much', 'I\'m proud of myself', 'I have many interests'] },
    { day: 0, hour: 14, summary: 'Today: Teaching art to younger students. Leadership and empathy. Sharing passion with others.', topics: ['Art', 'Teaching', 'Leadership', 'Empathy', 'Sharing'], emotion: 'Calm' as Emotion, phrases: ['I\'m teaching others', 'Sharing is rewarding', 'I like helping'] },
  ];
  
  // Combine all conversations
  const allMayaConvs = [...week1Conversations, ...week2Conversations, ...week3Conversations, ...week4Conversations];
  
  allMayaConvs.forEach(conv => {
    conversations.push({
      id: `maya-${convId++}`,
      childId: 'child2',
      timestamp: getDateDaysAgo(conv.day, conv.hour, 0),
      summary: conv.summary,
      topics: conv.topics,
      dominantEmotion: conv.emotion,
      highlightPhrases: conv.phrases,
    });
  });
  
  return conversations;
};

// Generate a full month of intricate conversations for Sam
const generateSamConversations = (): Conversation[] => {
  const conversations: Conversation[] = [];
  let convId = 1;
  
  // Week 1: Outdoor exploration, friend situation, imagination
  const week1Conversations = [
    { day: 30, hour: 10, summary: 'Discovered a new area in the park. Very excited about exploring. Found interesting rocks and bugs.', topics: ['Outdoor Play', 'Exploration', 'Nature', 'Discovery'], emotion: 'Excited' as Emotion, phrases: ['I found a new place!', 'There are so many bugs', 'Exploring is fun'] },
    { day: 29, hour: 15, summary: 'Friend moved away last month. Still missing them but making new friends. Emotional resilience showing.', topics: ['Friends', 'Emotions', 'Change', 'Resilience'], emotion: 'Worried' as Emotion, phrases: ['I miss my friend', 'But I\'m making new friends', 'Change is hard'] },
    { day: 28, hour: 11, summary: 'Watching favorite cartoon. Very engaged. Wants to draw the characters. Imagination and creativity.', topics: ['TV', 'Cartoons', 'Imagination', 'Art', 'Creativity'], emotion: 'Happy' as Emotion, phrases: ['I love this show', 'I want to draw them', 'Cartoons are fun'] },
    { day: 27, hour: 14, summary: 'Playing outside with new friend. Very happy. Building a fort together. Social connections forming.', topics: ['Friends', 'Outdoor Play', 'Building', 'Social'], emotion: 'Joyful' as Emotion, phrases: ['I made a new friend', 'Building forts is fun', 'I\'m happy'] },
    { day: 26, hour: 9, summary: 'Drawing cartoon characters. Very focused. Improving drawing skills. Creative expression.', topics: ['Art', 'Drawing', 'Cartoons', 'Creativity', 'Practice'], emotion: 'Calm' as Emotion, phrases: ['I\'m getting better at drawing', 'I love drawing', 'Practice helps'] },
    { day: 25, hour: 16, summary: 'Outdoor adventure - found a bird\'s nest. Very curious. Asked many questions about birds.', topics: ['Outdoor Play', 'Nature', 'Animals', 'Curiosity'], emotion: 'Curious' as Emotion, phrases: ['I found a nest!', 'How do birds make nests?', 'Nature is interesting'] },
    { day: 24, hour: 13, summary: 'Missing old friend but adapting. Talked about video calling them. Technology helping with connection.', topics: ['Friends', 'Technology', 'Connection', 'Adaptation'], emotion: 'Worried' as Emotion, phrases: ['I can video call them', 'Technology helps', 'I\'m adapting'] },
  ];
  
  // Week 2: Art skills improving, outdoor club, emotional growth
  const week2Conversations = [
    { day: 23, hour: 10, summary: 'Drawing improved significantly. Proud of progress. Showing drawings to family. Confidence building.', topics: ['Art', 'Drawing', 'Progress', 'Confidence', 'Family'], emotion: 'Happy' as Emotion, phrases: ['My drawings are better', 'I\'m proud', 'Everyone likes them'] },
    { day: 22, hour: 15, summary: 'Joined outdoor exploration club at school. Very excited. Meeting kids with similar interests.', topics: ['Outdoor Play', 'Club', 'School', 'Friends', 'Exploration'], emotion: 'Excited' as Emotion, phrases: ['I joined a club!', 'Kids like exploring too', 'This is fun'] },
    { day: 21, hour: 11, summary: 'Created story about cartoon characters. Very imaginative. Writing and drawing combined. Creative expression expanding.', topics: ['Imagination', 'Stories', 'Cartoons', 'Creativity', 'Writing'], emotion: 'Happy' as Emotion, phrases: ['I made up a story', 'I love creating', 'Imagination is fun'] },
    { day: 20, hour: 14, summary: 'Outdoor club activity - nature scavenger hunt. Very engaged. Learning about local plants and animals.', topics: ['Outdoor Play', 'Nature', 'Learning', 'Club', 'Exploration'], emotion: 'Curious' as Emotion, phrases: ['We found so many things', 'I learned about nature', 'This is interesting'] },
    { day: 19, hour: 9, summary: 'Video called old friend. Very happy. Connection maintained. Technology bridging distance.', topics: ['Friends', 'Technology', 'Connection', 'Communication'], emotion: 'Joyful' as Emotion, phrases: ['I talked to my friend!', 'Video calls are cool', 'We\'re still friends'] },
    { day: 18, hour: 16, summary: 'Drawing session with new friend. Collaborative and fun. Sharing techniques. Social and creative.', topics: ['Art', 'Drawing', 'Friends', 'Collaboration', 'Sharing'], emotion: 'Joyful' as Emotion, phrases: ['We drew together', 'Sharing is fun', 'I like collaborating'] },
    { day: 17, hour: 13, summary: 'Outdoor exploration - found interesting patterns in nature. Very observant. Noticing details.', topics: ['Outdoor Play', 'Nature', 'Observation', 'Exploration'], emotion: 'Curious' as Emotion, phrases: ['I notice patterns', 'Nature is detailed', 'I\'m observant'] },
  ];
  
  // Week 3: Leadership emerging, art sharing, emotional maturity
  const week3Conversations = [
    { day: 16, hour: 10, summary: 'Helping organize outdoor club activity. Leadership emerging. Taking initiative and responsibility.', topics: ['Leadership', 'Outdoor Play', 'Club', 'Responsibility'], emotion: 'Excited' as Emotion, phrases: ['I\'m helping organize', 'Leadership is fun', 'I like responsibility'] },
    { day: 15, hour: 15, summary: 'Art show at school - displayed drawings. Very proud. Recognition for creative work.', topics: ['Art', 'Drawing', 'School', 'Recognition', 'Success'], emotion: 'Joyful' as Emotion, phrases: ['My art is displayed!', 'People like my drawings', 'I\'m proud'] },
    { day: 14, hour: 11, summary: 'Teaching younger sibling to draw. Patient and kind. Empathy and teaching skills.', topics: ['Art', 'Teaching', 'Family', 'Empathy', 'Patience'], emotion: 'Calm' as Emotion, phrases: ['I\'m teaching my sibling', 'I\'m patient', 'Teaching is nice'] },
    { day: 13, hour: 14, summary: 'Outdoor club - leading nature walk. Confidence growing. Sharing knowledge with others.', topics: ['Leadership', 'Outdoor Play', 'Nature', 'Confidence', 'Sharing'], emotion: 'Happy' as Emotion, phrases: ['I led the walk', 'I shared what I know', 'I feel confident'] },
    { day: 12, hour: 9, summary: 'Created comic strip with cartoon characters. Very creative. Combining art and storytelling.', topics: ['Art', 'Cartoons', 'Stories', 'Creativity', 'Comics'], emotion: 'Excited' as Emotion, phrases: ['I made a comic!', 'Art and stories together', 'This is creative'] },
    { day: 11, hour: 16, summary: 'Outdoor exploration - documenting findings. Scientific observation. Learning and exploring combined.', topics: ['Outdoor Play', 'Nature', 'Observation', 'Science', 'Learning'], emotion: 'Curious' as Emotion, phrases: ['I\'m documenting things', 'I\'m like a scientist', 'Learning is fun'] },
    { day: 10, hour: 13, summary: 'Old friend visiting soon! Very excited. Maintaining friendship despite distance. Emotional resilience.', topics: ['Friends', 'Visiting', 'Excitement', 'Connection'], emotion: 'Excited' as Emotion, phrases: ['My friend is visiting!', 'I can\'t wait', 'Friendship lasts'] },
  ];
  
  // Week 4: Advanced creativity, community involvement, well-rounded growth
  const week4Conversations = [
    { day: 9, hour: 10, summary: 'Advanced drawing techniques. Teacher noticed improvement. Ready for more challenging projects.', topics: ['Art', 'Drawing', 'Growth', 'Learning', 'School'], emotion: 'Happy' as Emotion, phrases: ['I\'m getting better', 'I can do harder things', 'Growth feels good'] },
    { day: 8, hour: 15, summary: 'Outdoor club planning big exploration day. Leadership role. Organizing and coordinating.', topics: ['Leadership', 'Outdoor Play', 'Planning', 'Club', 'Organization'], emotion: 'Excited' as Emotion, phrases: ['I\'m planning the big day', 'I like organizing', 'Leadership is rewarding'] },
    { day: 7, hour: 11, summary: 'Comic series idea - multiple episodes planned. Long-term creative thinking. Storytelling skills developing.', topics: ['Art', 'Stories', 'Comics', 'Planning', 'Creativity'], emotion: 'Excited' as Emotion, phrases: ['I have a series idea', 'I\'m planning ahead', 'Stories are fun'] },
    { day: 6, hour: 14, summary: 'Helping new student at school. Empathy and kindness. Making others feel welcome.', topics: ['Friends', 'Helping', 'Empathy', 'School', 'Kindness'], emotion: 'Calm' as Emotion, phrases: ['I\'m helping someone new', 'I want to be kind', 'Helping feels good'] },
    { day: 5, hour: 9, summary: 'Outdoor exploration day was successful! Led activities. Very proud. Leadership skills confirmed.', topics: ['Leadership', 'Outdoor Play', 'Success', 'Club', 'Confidence'], emotion: 'Joyful' as Emotion, phrases: ['The day was great!', 'I led well', 'I\'m proud'] },
    { day: 4, hour: 16, summary: 'Art portfolio growing. Multiple styles explored. Creative range expanding. Well-rounded artist developing.', topics: ['Art', 'Portfolio', 'Growth', 'Creativity', 'Variety'], emotion: 'Happy' as Emotion, phrases: ['I have many styles', 'I\'m exploring', 'Creativity is fun'] },
    { day: 3, hour: 13, summary: 'Friend visit was wonderful! Reconnected in person. Friendship strengthened. Emotional connection maintained.', topics: ['Friends', 'Visiting', 'Connection', 'Emotions'], emotion: 'Joyful' as Emotion, phrases: ['The visit was great!', 'We\'re still best friends', 'I\'m so happy'] },
    { day: 2, hour: 10, summary: 'Teaching art class for younger kids. Leadership and teaching. Sharing passion with others.', topics: ['Art', 'Teaching', 'Leadership', 'Sharing', 'Kids'], emotion: 'Calm' as Emotion, phrases: ['I\'m teaching kids', 'Sharing is rewarding', 'I like helping'] },
    { day: 1, hour: 15, summary: 'Reflected on month. Proud of growth in art, leadership, friendships, and exploration. Well-rounded development.', topics: ['Reflection', 'Growth', 'Multiple Areas', 'Progress'], emotion: 'Happy' as Emotion, phrases: ['I\'ve grown so much', 'I\'m proud', 'I have many interests'] },
    { day: 0, hour: 11, summary: 'Today: Planning next creative project. Combining art, stories, and outdoor inspiration. Integrated thinking.', topics: ['Art', 'Planning', 'Creativity', 'Integration', 'Projects'], emotion: 'Excited' as Emotion, phrases: ['I have new ideas', 'I\'m combining interests', 'Creativity is endless'] },
  ];
  
  // Combine all conversations
  const allSamConvs = [...week1Conversations, ...week2Conversations, ...week3Conversations, ...week4Conversations];
  
  allSamConvs.forEach(conv => {
    conversations.push({
      id: `sam-${convId++}`,
      childId: 'child3',
      timestamp: getDateDaysAgo(conv.day, conv.hour, 0),
      summary: conv.summary,
      topics: conv.topics,
      dominantEmotion: conv.emotion,
      highlightPhrases: conv.phrases,
    });
  });
  
  return conversations;
};

// Generate all conversations
const alexConversations = generateAlexConversations();
const mayaConversations = generateMayaConversations();
const samConversations = generateSamConversations();

export const allConversations: Conversation[] = [
  ...alexConversations,
  ...mayaConversations,
  ...samConversations,
];

// Generate topic insights from actual conversation data
const generateTopicInsights = (childId: string, conversations: Conversation[]): TopicInsight[] => {
  const topicMap: Record<string, { count: number; emotions: Set<Emotion>; recentMentions: number; olderMentions: number }> = {};
  const recentDays = 7;
  const now = Date.now();
  
  conversations.forEach(conv => {
    const daysAgo = Math.floor((now - conv.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    const isRecent = daysAgo <= recentDays;
    
    conv.topics.forEach(topic => {
      if (!topicMap[topic]) {
        topicMap[topic] = { count: 0, emotions: new Set(), recentMentions: 0, olderMentions: 0 };
      }
      topicMap[topic].count++;
      topicMap[topic].emotions.add(conv.dominantEmotion);
      
      if (isRecent) {
        topicMap[topic].recentMentions++;
      } else {
        topicMap[topic].olderMentions++;
      }
    });
  });
  
  const insights: TopicInsight[] = [];
  
  Object.entries(topicMap).forEach(([topic, data]) => {
    // Calculate trend based on recent vs older mentions
    let trend: 'up' | 'down' | 'stable' = 'stable';
    const recentAvg = data.recentMentions / Math.min(recentDays, conversations.length);
    const olderAvg = data.olderMentions / Math.max(1, (30 - recentDays));
    
    if (recentAvg > olderAvg * 1.3) trend = 'up';
    else if (recentAvg < olderAvg * 0.7 && data.olderMentions > 0) trend = 'down';
    
    insights.push({
      topicName: topic,
      frequency: data.count, // Total mentions across all conversations
      trend,
      associatedEmotions: Array.from(data.emotions),
      category: undefined, // Will be determined by getTopicCategory
    });
  });
  
  return insights.sort((a, b) => b.frequency - a.frequency);
};

// Generate topic insights for each child
const alexTopics = generateTopicInsights('child1', alexConversations);
const mayaTopics = generateTopicInsights('child2', mayaConversations);
const samTopics = generateTopicInsights('child3', samConversations);

export const allTopics: Record<string, TopicInsight[]> = {
  child1: alexTopics,
  child2: mayaTopics,
  child3: samTopics,
};

// Generate daily summaries
const generateDailySummaries = (childId: string, conversations: Conversation[]): DailySummary[] => {
  const summaries: DailySummary[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dayConversations = conversations.filter(c => {
      const convDate = new Date(c.timestamp);
      convDate.setHours(0, 0, 0, 0);
      return convDate.getTime() === date.getTime();
    });
    
    if (dayConversations.length > 0) {
      const topTopics = dayConversations.flatMap(c => c.topics);
      const topicCounts = topTopics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const sortedTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topic]) => topic);
      
      const emotions = dayConversations.map(c => c.dominantEmotion);
      const emotionCounts = emotions.reduce((acc, em) => {
        acc[em] = (acc[em] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const avgEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] as Emotion || 'Neutral';
      
      const summaryText = dayConversations.length === 1
        ? dayConversations[0].summary
        : `${dayConversations.length} conversations today. ${dayConversations.map(c => c.summary).join(' ')}`;
      
      summaries.push({
        date,
        summaryText,
        topTopics: sortedTopics,
        averageEmotion: avgEmotion,
      });
    }
  }
  
  return summaries.reverse();
};

export const allDailySummaries: Record<string, DailySummary[]> = {
  child1: generateDailySummaries('child1', alexConversations),
  child2: generateDailySummaries('child2', mayaConversations),
  child3: generateDailySummaries('child3', samConversations),
};

// Generate emotion points
const generateEmotionPoints = (childId: string, conversations: Conversation[]): EmotionPoint[] => {
  return conversations.map(conv => {
    const emotionScores: Record<Emotion, number> = {
      'Joyful': 85,
      'Happy': 80,
      'Calm': 70,
      'Neutral': 60,
      'Curious': 75,
      'Excited': 90,
      'Frustrated': 40,
      'Anxious': 35,
      'Worried': 30,
      'Stressed': 25,
    };
    
    return {
      timestamp: conv.timestamp,
      dominantEmotion: conv.dominantEmotion,
      emotionScore: emotionScores[conv.dominantEmotion] || 60,
    };
  });
};

export const allEmotionPoints: Record<string, EmotionPoint[]> = {
  child1: generateEmotionPoints('child1', alexConversations),
  child2: generateEmotionPoints('child2', mayaConversations),
  child3: generateEmotionPoints('child3', samConversations),
};

// Mock Recommendations (unchanged)
const alexRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Robotics Club',
    description: 'Join a local robotics club to explore building and programming robots.',
    category: 'clubs',
    relatedTopics: ['Robots', 'STEM', 'Engineering'],
    reason: 'Based on recent excitement about space and technology.',
  },
  {
    id: 'rec2',
    title: 'LEGO Robotics Kit',
    description: 'Hands-on building and coding kit for young engineers.',
    category: 'resources',
    relatedTopics: ['Robots', 'LEGO', 'Coding'],
    reason: 'Shows strong interest in building and problem-solving.',
  },
  {
    id: 'rec3',
    title: 'Coding for Kids Resources',
    description: 'Online tutorials and apps designed for young learners.',
    category: 'resources',
    relatedTopics: ['Coding', 'Technology', 'Games'],
    reason: 'Expressed curiosity about how games and computers work.',
  },
  {
    id: 'rec4',
    title: 'Gentle Math Practice Apps',
    description: 'Fun, stress-free math learning applications.',
    category: 'resources',
    relatedTopics: ['Math', 'School'],
    reason: 'Shows some anxiety around math - gentle practice could help.',
  },
  {
    id: 'rec5',
    title: 'Soccer Afterschool Program',
    description: 'Structured soccer program with friends and coaches.',
    category: 'afterschool',
    relatedTopics: ['Sports', 'Friends', 'Soccer'],
    reason: 'Enjoys playing soccer and spending time with friends.',
  },
];

const mayaRecommendations: Recommendation[] = [
  {
    id: 'rec6',
    title: 'Art Studio Classes',
    description: 'Weekly art classes focusing on painting and creative expression.',
    category: 'afterschool',
    relatedTopics: ['Art', 'Painting', 'Creativity'],
    reason: 'Shows great joy and talent in artistic activities.',
  },
  {
    id: 'rec7',
    title: 'Dance Performance Group',
    description: 'Join a dance group that performs at local events.',
    category: 'afterschool',
    relatedTopics: ['Dance', 'Performance', 'Arts'],
    reason: 'Excited about dance and upcoming performances.',
  },
  {
    id: 'rec8',
    title: 'Piano Lessons',
    description: 'Structured piano lessons for beginners to advanced.',
    category: 'afterschool',
    relatedTopics: ['Music', 'Piano'],
    reason: 'Finds music calming and enjoyable.',
  },
  {
    id: 'rec9',
    title: 'Nature Exploration Books',
    description: 'Books about animals, plants, and ecosystems.',
    category: 'resources',
    relatedTopics: ['Nature', 'Animals', 'Biology'],
    reason: 'Curious about nature and biology.',
  },
];

const samRecommendations: Recommendation[] = [
  {
    id: 'rec10',
    title: 'Outdoor Adventure Club',
    description: 'Weekly outdoor activities and exploration.',
    category: 'clubs',
    relatedTopics: ['Outdoor Play', 'Exploration'],
    reason: 'Loves playing outside and exploring.',
  },
  {
    id: 'rec11',
    title: 'Art & Drawing Classes',
    description: 'Classes focused on drawing favorite characters and creative expression.',
    category: 'afterschool',
    relatedTopics: ['Art', 'Cartoons', 'Imagination'],
    reason: 'Shows interest in drawing and creative activities.',
  },
];

export const allRecommendations: Record<string, Recommendation[]> = {
  child1: alexRecommendations,
  child2: mayaRecommendations,
  child3: samRecommendations,
};

// Helper Functions
export const getChildById = (id: string): Child | undefined => {
  return mockChildren.find(child => child.id === id);
};

export const getAllChildren = (): Child[] => {
  // In development, check localStorage first for user's children
  if (import.meta.env.DEV) {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.children && user.children.length > 0) {
          const storedChildren = JSON.parse(localStorage.getItem('mockChildren') || '[]');
          const userChildren = storedChildren.filter((child: Child) => 
            user.children.includes(child.id)
          );
          if (userChildren.length > 0) {
            return userChildren;
          }
        }
      }
      // If no user-specific children, check if there are any children in localStorage
      const storedChildren = JSON.parse(localStorage.getItem('mockChildren') || '[]');
      if (storedChildren.length > 0) {
        return storedChildren;
      }
    } catch (e) {
      console.error('Error loading children from localStorage:', e);
    }
  }
  // Fallback to hardcoded mock children
  return mockChildren;
};

export const getConversationsForChild = (childId: string, dateRange?: DateRange): Conversation[] => {
  let conversations = allConversations.filter(c => c.childId === childId);
  
  if (dateRange) {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        conversations = conversations.filter(c => c.timestamp >= filterDate);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        conversations = conversations.filter(c => c.timestamp >= filterDate);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        conversations = conversations.filter(c => c.timestamp >= filterDate);
        break;
    }
  }
  
  return conversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getTopicsForChild = (childId: string): TopicInsight[] => {
  return allTopics[childId] || [];
};

export const getEmotionsForChild = (childId: string, dateRange?: DateRange): EmotionPoint[] => {
  let points = allEmotionPoints[childId] || [];
  
  if (dateRange) {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        points = points.filter(p => p.timestamp >= filterDate);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        points = points.filter(p => p.timestamp >= filterDate);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        points = points.filter(p => p.timestamp >= filterDate);
        break;
    }
  }
  
  return points.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const getRecommendationsForChild = (childId: string): Recommendation[] => {
  return allRecommendations[childId] || [];
};

export const getDailySummaries = (childId: string, dateRange?: DateRange): DailySummary[] => {
  let summaries = allDailySummaries[childId] || [];
  
  if (dateRange) {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        summaries = summaries.filter(s => s.date >= filterDate);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        summaries = summaries.filter(s => s.date >= filterDate);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        summaries = summaries.filter(s => s.date >= filterDate);
        break;
    }
  }
  
  return summaries.sort((a, b) => b.date.getTime() - a.date.getTime());
};
