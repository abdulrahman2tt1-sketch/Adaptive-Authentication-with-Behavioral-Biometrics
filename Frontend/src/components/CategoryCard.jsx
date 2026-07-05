import { Link } from "react-router-dom";
import {
  Code,
  Smartphone,
  BarChart3,
  Palette,
  Briefcase,
  Megaphone,
} from "lucide-react";

function CategoryCard({ category, courseCount }) {
  const getIcon = (slug) => {
    const icons = {
      "web-development": Code,
      "mobile-development": Smartphone,
      "data-science": BarChart3,
      design: Palette,
      business: Briefcase,
      marketing: Megaphone,
    };
    const Icon = icons[slug] || Code;
    return <Icon className="w-8 h-8" />;
  };

  const getGradient = (slug) => {
    const gradients = {
      "web-development": "from-blue-500 to-blue-600",
      "mobile-development": "from-purple-500 to-purple-600",
      "data-science": "from-green-500 to-green-600",
      design: "from-pink-500 to-pink-600",
      business: "from-amber-500 to-amber-600",
      marketing: "from-red-500 to-red-600",
    };
    return gradients[slug] || "from-primary to-primary";
  };

  return (
    <Link
      to={`/courses?category=${category.slug}`}
      className="group bg-card shadow-sm rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient(category.slug)} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {getIcon(category.slug)}
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
    </Link>
  );
}

export default CategoryCard;
