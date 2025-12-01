import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold group-hover:text-primary transition">
              SharePlate
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-primary transition">
              How It Works
            </Link>

            <Link to="/#roles" className="hover:text-primary transition">
              Get Started
            </Link>

            <Button asChild variant="outline" size="sm">
              <Link to="/auth?mode=login">Login</Link>
            </Button>

            <Button asChild variant="hero" size="sm">
              <Link to="/auth?mode=signup">Join Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-up">
            <div className="flex flex-col gap-4">
              <Link
                to="/how-it-works"
                className="py-2 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>

              <Link
                to="/#roles"
                className="py-2 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/auth?mode=login">Login</Link>
              </Button>

              <Button asChild variant="hero" size="sm" className="w-full">
                <Link to="/auth?mode=signup">Join Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
