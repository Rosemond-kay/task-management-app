import React from "react";
import { useAuthStore } from "../../stores/useAuthStore";

interface FooterProps {
  onNavigate?: (view: "dashboard" | "admin") => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const user = useAuthStore((state) => state.user);

  const handleNavigate = (view: "dashboard" | "admin") => {
    if (onNavigate) {
      onNavigate(view);
      // Scroll to top when navigating
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      className="bg-[var(--bg-paper)] border-t border-[var(--border-color)] mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1 - Brand */}
          <div className="space-y-3">
            <h3 className="text-[var(--color-primary)]">TaskFlow</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Organize your tasks, simplify your workflow.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[var(--text-primary)]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate("dashboard")}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  My Tasks
                </button>
              </li>
              {user?.role === "admin" && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate("admin")}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  >
                    Admin Panel
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div className="space-y-3">
            <h4 className="text-[var(--text-primary)]">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#documentation"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  onClick={(e) => e.preventDefault()}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Rosemond-kay/task-management-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 md:my-8 border-t border-[var(--border-color)]" />

        {/* Bottom Copyright Row */}
        <div className="text-center space-y-1">
          <p className="text-sm text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} TaskFlow. Built with ❤️ by Rosemond.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">Powered by React + Zustand + Vite</p>
        </div>
      </div>
    </footer>
  );
};
