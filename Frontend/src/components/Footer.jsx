import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">
                LearnHub
              </span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Empowering learners worldwide with quality online education. Start
              your learning journey today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Become a Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-background mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses?category=web-development"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/courses?category=data-science"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Data Science
                </Link>
              </li>
              <li>
                <Link
                  to="/courses?category=design"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  to="/courses?category=marketing"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="w-4 h-4" />
                support@learnhub.com
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="w-4 h-4" />
                +20 1101708108
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <MapPin className="w-4 h-4" />
                Cairo, Egypt
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
