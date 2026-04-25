import React, { useState, useEffect } from "react";
import { Monitor, Briefcase, ChevronLeft, Code, BookOpen, ExternalLink, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const SimpleFacultyButton = ({ title, subtitle, icon: Icon, onClick, accentColor = "#ff8f20" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="help-select-card"
    style={{ "--help-select-accent": accentColor }}
  >
    <div className="help-select-card-icon">
      <Icon size={24} />
    </div>
    <div className="help-select-card-copy">
      <strong>{title}</strong>
      {subtitle ? <span>{subtitle}</span> : null}
    </div>
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
        className="help-inline-link mt-2"
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
              className="help-btn help-back-btn"
            >
              <div className="help-back-btn-icon">
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
                  subtitle="Coding, software, and technical learning materials."
                  accentColor="#29b6d9"
                />
              </motion.div>
            )}

            {(!selectedFaculty || selectedFaculty === "Business") && (
              <motion.div layout>
                <SimpleFacultyButton
                  title="Faculty of Business"
                  icon={Briefcase}
                  onClick={() => setSelectedFaculty("Business")}
                  subtitle="Guides, module references, and business resources."
                  accentColor="#ff9a3c"
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
                    subtitle="Practical coding support, concepts, and references."
                    accentColor="#9466ff"
                  />
                  <SimpleFacultyButton
                    title="Module Guide"
                    icon={BookOpen}
                    onClick={() => setSelectedCategory("Module Guide")}
                    subtitle="Structured notes and module-focused study guidance."
                    accentColor="#22b68d"
                  />
                </>
              ) : (
                <SimpleFacultyButton
                  title="Module Guide"
                  icon={BookOpen}
                  onClick={() => setSelectedCategory("Module Guide")}
                  subtitle="Structured notes and module-focused study guidance."
                  accentColor="#22b68d"
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



