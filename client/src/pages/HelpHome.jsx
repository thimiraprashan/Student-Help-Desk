import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Mail, MapPin, Monitor, Phone, Search } from "lucide-react";
import aiImage from "../assets/How-long-does-it-take-learn-AI.jpg";
import studyImage from "../assets/Study guid.png";
import pastPapersImage from "../assets/past papers.png";
import contactImage from "../assets/Contact sliit.png";

const facultyCards = [
  {
    title: "Faculty of Computing",
    text: "Get help with computing courses, resources and technical support.",
    icon: Monitor,
    tone: "blue",
  },
  {
    title: "Faculty of Business",
    text: "Get assistance for business studies, management and related subjects.",
    icon: BriefcaseBusiness,
    tone: "orange",
  },
];

const contactOptions = [
  { label: "Visit Us", icon: MapPin },
  { label: "Call Us", icon: Phone },
  { label: "Email Us", icon: Mail },
  { label: "Connect Online", icon: MessageBubble },
];

function HelpHome() {
  const navigate = useNavigate();

  return (
    <section className="help-dashboard">
      <div className="help-dashboard-head">
        <div>
          <p className="help-kicker">Welcome to</p>
          <h1>SLIIT Help Center</h1>
          <p className="help-subtitle">
            How can we help you today? Choose an option below.
          </p>
        </div>

        <label className="help-search">
          <Search size={22} strokeWidth={2.2} />
          <input type="search" placeholder="Search for help..." />
        </label>
      </div>

      <div className="help-faculty-grid">
        {facultyCards.map((card) => {
          const Icon = card.icon;

          return (
            <button type="button" className="help-faculty-card" key={card.title}>
              <span className={`help-faculty-icon help-faculty-icon-${card.tone}`}>
                <Icon size={33} strokeWidth={2.4} />
              </span>
              <span className="help-faculty-copy">
                <strong>{card.title}</strong>
                <span>{card.text}</span>
              </span>
              <span className={`help-faculty-arrow help-faculty-arrow-${card.tone}`}>
                <ArrowRight size={22} strokeWidth={2.5} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="help-card-grid">
        <article className="help-hero-card help-ai-card">
          <img src={aiImage} alt="" />
          <div className="help-panel-overlay" />
          <div className="help-panel-content">
            <h2>Learn with AI</h2>
            <p>Get smart answers and explanations instantly.</p>
            <button type="button" onClick={() => navigate("/help/ai")} className="help-action help-action-light">
              <span>Explore Now</span>
              <ArrowRight size={17} strokeWidth={2.7} />
            </button>
          </div>
        </article>

        <article className="help-hero-card help-study-card">
          <img src={studyImage} alt="" />
          <div className="help-panel-content help-panel-dark">
            <h2>Study Guide</h2>
            <p>Access study materials, guides and useful resources.</p>
            <button type="button" onClick={() => navigate("/help/study")} className="help-action help-action-green">
              <span>View Guides</span>
              <ArrowRight size={17} strokeWidth={2.7} />
            </button>
          </div>
        </article>

        <article className="help-hero-card help-paper-card">
          <img src={pastPapersImage} alt="" />
          <div className="help-panel-content help-panel-dark">
            <h2>Past Papers</h2>
            <p>Download past papers and practice for your exams.</p>
            <button type="button" onClick={() => navigate("/help/papers")} className="help-action help-action-orange">
              <span>View Papers</span>
              <ArrowRight size={17} strokeWidth={2.7} />
            </button>
          </div>
        </article>

        <article className="help-hero-card help-contact-card">
          <img src={contactImage} alt="" />
          <div className="help-panel-content help-panel-dark">
            <h2>Contact SLIIT</h2>
            <p>Reach out to us through your preferred channel.</p>
            <div className="help-contact-actions">
              {contactOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button type="button" key={option.label} onClick={() => navigate("/help/contact")}>
                    <span>
                      <Icon size={25} strokeWidth={2.4} />
                    </span>
                    <strong>{option.label}</strong>
                  </button>
                );
              })}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function MessageBubble(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 18.5H7a4.5 4.5 0 0 1-4.5-4.5v-3A6.5 6.5 0 0 1 9 4.5h6A6.5 6.5 0 0 1 21.5 11v2.5A5.5 5.5 0 0 1 16 19h-4.25L7.5 21.5v-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

export default HelpHome;
