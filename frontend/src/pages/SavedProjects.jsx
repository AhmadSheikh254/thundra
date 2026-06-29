import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Database, Clock, ChevronLeft, Plus, Play, Trash, 
  Sparkles, Music, Film, AlertCircle 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = 'http://localhost:5000/api';

export default function SavedProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        throw new Error("Failed to fetch projects.");
      }
    } catch (err) {
      console.warn("Backend server offline or unreachable. Loading fallback projects.", err);
      setIsOfflineMode(true);
      const cached = localStorage.getItem('thundra_projects_mock');
      if (cached) {
        setProjects(JSON.parse(cached));
      } else {
        const presetMock = [
          {
            _id: "preset_1",
            title: "AI Revolutions & Future Tech",
            prompt: "Make a 60s viral TikTok about AI trends with captions, background music, and B-roll",
            musicStyle: "Futuristic Cyberpunk Synthwave",
            scenes: [
              { id: 1, timeStart: 0, timeEnd: 5, text: "AI is reshaping our world faster than anyone predicted.", brollSuggestion: "Animated laser lights representing AI networks", mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41712-large.mp4" }
            ],
            captions: [{ id: 1, timeStart: 0, timeEnd: 3, text: "AI is reshaping..." }],
            broll: ["Cyberpunk city", "Keyboard coding"],
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            _id: "preset_2",
            title: "Special Pakistani Biryani Recipe",
            prompt: "Create a cooking video for Biryani with traditional fusion beats",
            musicStyle: "Acoustic Folk / Chill Foodie Fusion",
            scenes: [
              { id: 1, timeStart: 0, timeEnd: 5, text: "Good food is the foundation of genuine happiness.", brollSuggestion: "Fresh vegetables being cut", mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-preparing-delicious-fresh-vegetable-salad-40621-large.mp4" }
            ],
            captions: [{ id: 1, timeStart: 0, timeEnd: 3, text: "Good food is..." }],
            broll: ["Sizzling pan", "Slicing veggies"],
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
          }
        ];
        setProjects(presetMock);
        localStorage.setItem('thundra_projects_mock', JSON.stringify(presetMock));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenProject = (project) => {
    sessionStorage.setItem('currentProjectPlan', JSON.stringify(project));
    navigate('/editor', { state: { projectPlan: project } });
  };

  const handleCreateNew = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-body relative flex flex-col justify-between">

      <div>
        {/* HEADER NAV */}
        <Navbar />

        {/* MAIN CONTAINER */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16 space-y-8">
          
          {/* Dashboard Title & Offline alert */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-heading text-white flex items-center gap-2.5">
                <Database className="w-6 h-6 text-blueTheme" />
                <span>Project History</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1 font-body">
                View, load, and manage your AI-generated timeline editing projects.
              </p>
            </div>

            {isOfflineMode && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-2 rounded-xl text-yellow-500 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Offline Cache Active: Saved in local browser state.</span>
              </div>
            )}
          </div>

          {/* LOADING STATE */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blueTheme" />
              <span className="text-sm text-slate-400">Fetching project history logs...</span>
            </div>
          ) : projects.length === 0 ? (
            /* EMPTY STATE */
            <div className="border border-white/[0.05] rounded-2xl bg-secondaryBg/40 backdrop-blur-md p-12 text-center max-w-xl mx-auto space-y-5 relative overflow-hidden shadow-2xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
              <div className="w-12 h-12 rounded-full bg-purpleTheme/10 border border-purpleTheme/20 flex items-center justify-center mx-auto text-blueTheme">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">No projects saved yet</h3>
                <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                  Describe a video on the homepage, watch the simulation pipeline, and export your setup to save history!
                </p>
              </div>
              <button
                onClick={handleCreateNew}
                className="px-5 py-2 bg-gradient-to-r from-purpleTheme to-blueTheme hover:shadow-lg hover:shadow-blueTheme/15 text-xs font-bold rounded-lg transition-all text-white active:scale-[0.98]"
              >
                Start Editing
              </button>
            </div>
          ) : (
            /* PROJECTS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <motion.div
                  key={project._id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="rounded-2xl p-5 border border-white/[0.05] bg-secondaryBg/60 backdrop-blur-md flex flex-col justify-between hover:border-blueTheme/30 hover:shadow-[0_8px_30px_rgba(7,11,18,0.8)] transition-all group relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-semibold text-blueTheme bg-blueTheme/10 border border-blueTheme/20 px-2 py-0.5 rounded">
                        20s Edit
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm text-white font-heading truncate group-hover:text-blueTheme transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 italic leading-relaxed">
                        "{project.prompt}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-blueTheme" />
                        <span>{project.scenes?.length || 0} Scene Clips</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Music className="w-3.5 h-3.5 text-pinkTheme" />
                        <span className="truncate">{project.musicStyle || 'Synthwave Beat'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 flex gap-2">
                    <button
                      onClick={() => handleOpenProject(project)}
                      className="flex-1 py-2 bg-gradient-to-r from-purpleTheme to-blueTheme text-white font-semibold text-xs rounded-lg hover:shadow-lg hover:shadow-blueTheme/15 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purpleTheme/15"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Open Editor</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* COMPREHENSIVE PROFESSIONAL FOOTER */}
      <Footer />
    </div>
  );
}
