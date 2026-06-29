const Project = require('../models/Project');

// In-memory array fallback if MongoDB is not available
const inMemoryProjects = [];

// Helper function to check if mongoose is connected
const isDbConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Preset data for custom prompt matching
const THEME_PRESETS = {
  ai: {
    title: "AI Revolutions & Future Tech",
    musicStyle: "Futuristic Cyberpunk Synthwave",
    broll: ["Cyberpunk city", "Keyboard coding", "Glowing AI interface", "Digital neural network"],
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "AI is reshaping our world faster than anyone predicted.",
        brollSuggestion: "Animated laser lights representing AI networks",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "From self-writing code to generative design tools.",
        brollSuggestion: "Developer typing lines of code in a dark room",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "Those who adapt now will build the future.",
        brollSuggestion: "Network connections connecting global servers",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-and-dots-41613-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Are you ready for the next level of human evolution?",
        brollSuggestion: "Glow particle stream in cyber space",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4"
      }
    ],
    captions: [
      { id: 1, timeStart: 0, timeEnd: 3, text: "AI is reshaping our world..." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "...faster than anyone predicted!" },
      { id: 3, timeStart: 5, timeEnd: 8, text: "From self-writing code..." },
      { id: 4, timeStart: 8, timeEnd: 10, text: "...to generative design tools." },
      { id: 5, timeStart: 10, timeEnd: 13, text: "Those who adapt now..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...will build the future." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Are you ready..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...for human evolution?" }
    ]
  },
  food: {
    title: "The Perfect Recipe",
    musicStyle: "Acoustic Folk / Chill Foodie Fusion",
    broll: ["Sizzling pan", "Slicing fresh vegetables", "Pouring hot tea", "Plating gourmet meal"],
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "Good food is the foundation of genuine happiness.",
        brollSuggestion: "Fresh vegetables being cut and prepared for cooking",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-preparing-delicious-fresh-vegetable-salad-40621-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "Hear that? The sound of fresh ingredients meeting heat.",
        brollSuggestion: "Sizzling meat cooking on a hot grill pan",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-sizzling-meat-on-a-hot-grill-42247-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "A dash of spices, a pinch of love, and perfect timing.",
        brollSuggestion: "Chef mixing and stirring in a pan",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-stirring-food-in-a-pan-40535-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Ready to take your taste buds on a wild journey?",
        brollSuggestion: "Warm soup or dish being served elegantly",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-sauce-over-delicious-cooked-meal-40541-large.mp4"
      }
    ],
    captions: [
      { id: 1, timeStart: 0, timeEnd: 3, text: "Good food is..." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "...the foundation of happiness." },
      { id: 3, timeStart: 5, timeEnd: 8, text: "Hear that sizzling sound?" },
      { id: 4, timeStart: 8, timeEnd: 10, text: "Fresh ingredients on heat." },
      { id: 5, timeStart: 10, timeEnd: 13, text: "A dash of spices..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...and a pinch of love." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Ready for a..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...wild taste journey?" }
    ]
  },
  travel: {
    title: "Escape into the Wild",
    musicStyle: "Upbeat Indie Folk & Cinematic Acoustic",
    broll: ["Mountain peaks", "Green pine forests", "Ocean waves crashing", "Walking down a scenic trail"],
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "We travel not to escape life, but for life not to escape us.",
        brollSuggestion: "Aerial view of lush green forest and massive mountain ranges",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-and-mountains-41221-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "There is something magical about exploring uncharted territories.",
        brollSuggestion: "Scenic view of a coastal road next to the sea",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-coastal-road-aerial-shot-with-crashing-waves-41584-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "Every trail leads to a new story waiting to be told.",
        brollSuggestion: "Hiker looking out over a gorgeous canyon view",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hiker-standing-on-top-of-mountain-enjoying-view-41228-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Pack your bags. The world is calling.",
        brollSuggestion: "Epic sunset over a beautiful tropical ocean beach",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-the-beach-at-sunset-12185-large.mp4"
      }
    ],
    captions: [
      { id: 1, timeStart: 0, timeEnd: 3, text: "We travel not to escape..." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "...but for life to stay with us." },
      { id: 3, timeStart: 5, timeEnd: 8, text: "Something magical about..." },
      { id: 4, timeStart: 8, timeEnd: 10, text: "...exploring uncharted lands." },
      { id: 5, timeStart: 10, timeEnd: 13, text: "Every trail leads to..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...a brand new story." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Pack your bags..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...the world is calling!" }
    ]
  },
  fitness: {
    title: "No Excuses - Workout Motivation",
    musicStyle: "Aggressive Viral Gym Phonk",
    broll: ["Dumbbell lifting", "Heavy workout", "Sweat dripping", "Running on a track"],
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "The pain you feel today will be the strength you feel tomorrow.",
        brollSuggestion: "Athletic man lifting heavy weights in the gym",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-athletic-man-training-hard-in-the-gym-40546-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "Success isn't given. It is earned on the gym floor.",
        brollSuggestion: "A person preparing to lift or grip a barbell",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-clamping-a-barbell-40552-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "Push past your limits, because comfort is the enemy of growth.",
        brollSuggestion: "A runner sprinting hard down an athletics track",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-sprinting-on-running-track-40559-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Refuse to yield. Get up and make it count.",
        brollSuggestion: "Tired athlete catching their breath after workout",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-exhausted-man-resting-in-gym-40557-large.mp4"
      }
    ],
    captions: [
      { id: 1, timeStart: 0, timeEnd: 3, text: "The pain you feel today..." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "...will be your strength tomorrow." },
      { id: 3, timeStart: 5, timeEnd: 8, text: "Success isn't given..." },
      { id: 4, timeStart: 8, timeEnd: 10, text: "...it is earned." },
      { id: 5, timeStart: 10, timeEnd: 13, text: "Push past your limits..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...comfort is the enemy." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Refuse to yield..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...make it count!" }
    ]
  },
  gaming: {
    title: "Apex Arena: Ultimate Gameplay",
    musicStyle: "Intense Cyber Electro Beat",
    broll: ["Gamer clicking mouse", "First person shooter gameplay", "Neon gaming setups", "Controller handling"],
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "Enter the arena. Focus up, because error is not an option.",
        brollSuggestion: "First person shooter battle gameplay video",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-gamer-playing-first-person-shooter-video-game-40347-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "Lightning fast reflexes and absolute mouse precision.",
        brollSuggestion: "Professional gamer clicking a glowing RGB gaming mouse",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-professional-gamer-clicking-mouse-close-up-40341-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "Coordinate with your squad. Secure the high ground.",
        brollSuggestion: "Hands holding a game console controller playing in a dark room",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-gamer-playing-with-a-controller-42241-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Another victory claimed. GG, squad.",
        brollSuggestion: "Gamer raising hands in victory after winning a round",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-winning-a-match-in-esports-championship-40343-large.mp4"
      }
    ],
    captions: [
      { id: 1, timeStart: 0, timeEnd: 3, text: "Enter the arena." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "Error is not an option." },
      { id: 3, timeStart: 5, timeEnd: 8, text: "Lightning fast reflexes..." },
      { id: 4, timeStart: 8, timeEnd: 10, text: "...absolute precision." },
      { id: 5, timeStart: 10, timeEnd: 13, text: "Coordinate with your squad..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...secure the high ground." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Another victory claimed..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...GG squad!" }
    ]
  },
  default: {
    title: "Viral TikTok Creator Plan",
    musicStyle: "Trending Lofi Beat / Modern Pop Mix",
    broll: ["Camera setup", "Neon room lighting", "Editing timelines", "Recording vlog"],
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 5,
        text: "Creating content that commands attention starts here.",
        brollSuggestion: "Camera tripod setup in a beautifully lit creator studio",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-setting-up-a-camera-tripod-40898-large.mp4"
      },
      {
        id: 2,
        timeStart: 5,
        timeEnd: 10,
        text: "Keep the cuts fast, the captions bold, and hook them early.",
        brollSuggestion: "Keyboard typing inside a stylized dark glowing room",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-computer-keyboard-40613-large.mp4"
      },
      {
        id: 3,
        timeStart: 10,
        timeEnd: 15,
        text: "Synchronize visuals to the beat of viral soundtrack styles.",
        brollSuggestion: "Neon particle light flow synced to rhythm",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4"
      },
      {
        id: 4,
        timeStart: 15,
        timeEnd: 20,
        text: "Hit publish and watch the algorithm do its magic.",
        brollSuggestion: "Glow cyber space lines connecting networks",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-and-dots-41613-large.mp4"
      }
    ],
    captions: [
      { id: 1, timeStart: 0, timeEnd: 3, text: "Creating viral content..." },
      { id: 2, timeStart: 3, timeEnd: 5, text: "...starts right here." },
      { id: 3, timeStart: 5, timeEnd: 8, text: "Keep the cuts fast..." },
      { id: 4, timeStart: 8, timeEnd: 10, text: "...and hook them early!" },
      { id: 5, timeStart: 10, timeEnd: 13, text: "Sync the visuals..." },
      { id: 6, timeStart: 13, timeEnd: 15, text: "...to trending beats." },
      { id: 7, timeStart: 15, timeEnd: 18, text: "Hit publish..." },
      { id: 8, timeStart: 18, timeEnd: 20, text: "...watch the algorithm!" }
    ]
  }
};

// POST /api/generate-plan
exports.generatePlan = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    const lowerPrompt = prompt.toLowerCase();
    let selectedTheme = "default";

    if (lowerPrompt.includes("ai") || lowerPrompt.includes("artificial intelligence") || lowerPrompt.includes("tech") || lowerPrompt.includes("robot") || lowerPrompt.includes("cyber")) {
      selectedTheme = "ai";
    } else if (lowerPrompt.includes("food") || lowerPrompt.includes("cook") || lowerPrompt.includes("chef") || lowerPrompt.includes("recipe") || lowerPrompt.includes("biryani") || lowerPrompt.includes("tea") || lowerPrompt.includes("chai")) {
      selectedTheme = "food";
    } else if (lowerPrompt.includes("travel") || lowerPrompt.includes("vlog") || lowerPrompt.includes("mountain") || lowerPrompt.includes("beach") || lowerPrompt.includes("trip") || lowerPrompt.includes("explore")) {
      selectedTheme = "travel";
    } else if (lowerPrompt.includes("gym") || lowerPrompt.includes("fit") || lowerPrompt.includes("workout") || lowerPrompt.includes("train") || lowerPrompt.includes("muscle") || lowerPrompt.includes("run")) {
      selectedTheme = "fitness";
    } else if (lowerPrompt.includes("game") || lowerPrompt.includes("gaming") || lowerPrompt.includes("play") || lowerPrompt.includes("esport") || lowerPrompt.includes("xbox") || lowerPrompt.includes("playstation")) {
      selectedTheme = "gaming";
    }

    const preset = THEME_PRESETS[selectedTheme];

    // Return the generated structured plan
    return res.status(200).json({
      prompt,
      title: preset.title,
      musicStyle: preset.musicStyle,
      scenes: preset.scenes,
      captions: preset.captions,
      broll: preset.broll,
      editingSteps: [
        { name: "Analyzing script requirements", duration: 1200 },
        { name: "Extracting timeline scenes", duration: 1800 },
        { name: "Generating Urdu captions & overlay tracks", duration: 1400 },
        { name: "Matching dynamic B-roll clips from Pexels API", duration: 2000 },
        { name: "Adding seamless transitions and sound effects", duration: 1500 },
        { name: "Syncing background music & grading video tones", duration: 1300 }
      ]
    });
  } catch (error) {
    console.error("Error generating editing plan:", error);
    return res.status(500).json({ message: "Server error generating plan." });
  }
};

// POST /api/save-project
exports.saveProject = async (req, res) => {
  try {
    const { prompt, title, musicStyle, scenes, captions, broll } = req.body;
    
    if (!prompt || !title) {
      return res.status(400).json({ message: "Prompt and Title are required to save." });
    }

    const projectData = {
      prompt,
      title,
      musicStyle,
      scenes,
      captions,
      broll,
      createdAt: new Date()
    };

    if (isDbConnected()) {
      const newProject = new Project(projectData);
      const savedProject = await newProject.save();
      return res.status(201).json({ message: "Project saved to MongoDB successfully!", project: savedProject });
    } else {
      // Save to memory
      projectData._id = "mock_" + Math.random().toString(36).substr(2, 9);
      inMemoryProjects.unshift(projectData);
      return res.status(201).json({ 
        message: "Saved successfully to local Session Memory (MongoDB offline)!", 
        project: projectData,
        isMockMode: true
      });
    }
  } catch (error) {
    console.error("Error saving project:", error);
    return res.status(500).json({ message: "Server error saving project." });
  }
};

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbProjects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(dbProjects);
    } else {
      return res.status(200).json(inMemoryProjects);
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Server error fetching projects." });
  }
};
