import { BookOpen, LayoutDashboard, MessageCircle, Tag } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, title: "Dashboard", view: "dashboard" },
  {
    icon: BookOpen,
    title: "Courses",
    view: "courses",
    badgeColor: "amber",
  },
  { icon: Tag, title: "Categories", view: "categories" },
];

function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="w-[230px] min-w-[230px] bg-white border-r border-stone-200 flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-[18px] border-b border-stone-100">
        <BookOpen className="w-5 h-5 text-stone-800" />
        <span className="text-base font-bold text-stone-900">LearnHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 px-2 pt-3 pb-1">
          Main
        </p>

        {NAV_ITEMS.map(({ icon: Icon, title, view, badge, badgeColor }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors mb-[2px] w-full text-left
              ${
                activeView === view
                  ? "bg-stone-100 text-stone-900 font-medium"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <span className="flex-1">{title}</span>
            {badge && (
              <span
                className={`text-[11px] font-medium text-white rounded-full px-2 py-px min-w-[20px] text-center
                  ${badgeColor === "red" ? "bg-[#e05c3a]" : "bg-amber-400"}`}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
