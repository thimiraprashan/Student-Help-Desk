import React, { useState, useEffect } from "react";
import { Monitor, Briefcase, ChevronLeft, Code, BookOpen, ExternalLink, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const SimpleFacultyButton = ({ title, icon: Icon, onClick, accentColor = "bg-orange-500" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative flex items-center gap-4 w-full max-w-md px-6 py-4 bg-white border border-slate-200 rounded-2xl group transition-all duration-300 hover:border-orange-500/30 shadow-sm hover:shadow-md"
  >
    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 ${accentColor} rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(243,156,18,0.3)]`} />
    <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20 transition-colors">
      <Icon size={24} />
    </div>
    <span className="text-xl font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
      {title}
    </span>
  </motion.button>
);

const MaterialCard = ({ title, description, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-4 hover:border-orange-500/30 transition-all shadow-sm hover:shadow-md"
  >
    <div className="flex justify-between items-start">
      <h4 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h4>
      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
        <FileText size={18} />
      </div>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    {content && (
      <a
        href={content}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
      >
        View Resource
        <ExternalLink size={14} />
      </a>
    )}
  </motion.div>
);

function StudyGuide() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFaculty && selectedCategory) {
      fetchMaterials();
    }
  }, [selectedFaculty, selectedCategory]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/study-guide`, {
        params: { faculty: selectedFaculty, category: selectedCategory }
      });
      setMaterials(res.data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setMaterials([]);
    } else {
      setSelectedFaculty(null);
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] p-6">
      {/* Top Bar */}
      <div className="h-12 mb-8">
        <AnimatePresence>
          {selectedFaculty && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors group"
            >
              <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-orange-50">
                <ChevronLeft size={20} />
              </div>
              <span className="font-medium">
                {selectedCategory ? `Back to ${selectedFaculty} Categories` : "Back to Faculties"}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center justify-start gap-8 flex-1">
        {/* Step 1: Faculty Selection */}
        {!selectedCategory && (
          <div className="flex flex-row items-center justify-center gap-8 flex-wrap w-full">
            {(!selectedFaculty || selectedFaculty === "Computing") && (
              <motion.div layout>
                <SimpleFacultyButton
                  title="Faculty of Computing"
                  icon={Monitor}
                  onClick={() => setSelectedFaculty("Computing")}
                  accentColor="bg-cyan-400"
                />
              </motion.div>
            )}

            {(!selectedFaculty || selectedFaculty === "Business") && (
              <motion.div layout>
                <SimpleFacultyButton
                  title="Faculty of Business"
                  icon={Briefcase}
                  onClick={() => setSelectedFaculty("Business")}
                  accentColor="bg-orange-400"
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Step 2: Category Selection */}
        <AnimatePresence mode="wait">
          {selectedFaculty && !selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="w-full max-w-md h-px bg-slate-200 my-2" />
              
              {selectedFaculty === "Computing" ? (
                <>
                  <SimpleFacultyButton
                    title="Programming"
                    icon={Code}
                    onClick={() => setSelectedCategory("Programming")}
                    accentColor="bg-purple-400"
                  />
                  <SimpleFacultyButton
                    title="Module Guide"
                    icon={BookOpen}
                    onClick={() => setSelectedCategory("Module Guide")}
                    accentColor="bg-emerald-400"
                  />
                </>
              ) : (
                <SimpleFacultyButton
                  title="Module Guide"
                  icon={BookOpen}
                  onClick={() => setSelectedCategory("Module Guide")}
                  accentColor="bg-emerald-400"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Material Display */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl"
            >
              <div className="mb-8 flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-orange-50 text-orange-600`}>
                  {selectedCategory === "Programming" ? <Code size={24} /> : <BookOpen size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{selectedCategory}</h3>
                  <p className="text-slate-500 text-sm">{selectedFaculty} Study Materials</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-500">Loading resources...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {materials.map((m) => (
                    <MaterialCard
                      key={m._id}
                      title={m.title}
                      description={m.description}
                      content={m.content}
                    />
                  ))}
                  {materials.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 italic">
                      No materials available for this category yet.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default StudyGuide;


