import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Bot,
  Building2,
  FileText,
  Home,
  MessageCircle,
  Phone,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/help", end: true, icon: Home, tone: "blue" },
  { label: "Learn with AI", to: "/help/ai", icon: Bot, tone: "purple" },
  { label: "Study Guide", to: "/help/study", icon: BookOpen, tone: "mint" },
  { label: "Past Papers", to: "/help/papers", icon: FileText, tone: "amber" },
  { label: "Contact SLIIT", to: "/help/contact", icon: Phone, tone: "pink" },
];

function HelpSidebar() {
  return (
    <aside className="help-sidebar">
      <div>
        <div className="help-sidebar-title">
          <Building2 size={30} strokeWidth={2.4} />
          <span>SLIIT Help</span>
        </div>

        <nav className="help-sidebar-nav" aria-label="Help center">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `help-sidebar-link ${isActive ? "is-active" : ""}`
                }
              >
                <span className={`help-sidebar-icon help-sidebar-icon-${item.tone}`}>
                  <Icon size={24} strokeWidth={2.6} />
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="help-sidebar-card">
        <h3>Need Instant Help?</h3>
        <p>Chat with our AI assistant 24/7 for quick solutions.</p>
        <NavLink to="/help/ai" className="help-sidebar-chat">
          <MessageCircle size={18} strokeWidth={2.5} />
          <span>Chat Now</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default HelpSidebar;
