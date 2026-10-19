import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import RoleCard from "@/components/RoleCard";
import { Users, Package, Truck, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import heroImage from "@/assets/shareplate.png";
import { useEffect } from "react";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10 pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">

              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
                🌱 Reducing Food Waste Together
              </span>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Share a Plate,
                <br />
                <span className="gradient-primary bg-clip-text text-transparent">
                  Change a Life
                </span>
              </h1>

              <p className="text-xl text-muted-foreground">
                SharePlate connects businesses and households with surplus food to local recipients and community groups who can make use of it.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                {/* JOIN NOW → SIGNUP PAGE */}
                <Button asChild variant="hero" size="lg">
                  <Link to="/auth?mode=signup">Join SharePlate</Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">Learn More</Link>
                </Button>
              </div>

            </div>

            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                className="relative rounded-3xl shadow-elevated w-full animate-float"
                alt="Community sharing food"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sign up as a donor to share food, or as a recipient to find and collect meals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <RoleCard
              icon={UtensilsCrossed}
              title="Donor"
              description="Donate extra meals and ingredients"
              features={[
                "List available food in minutes",
                "Set pickup address and times",
                "Track claims and completed handovers",
              ]}
              route="/auth?mode=signup&role=donor"
            />

            <RoleCard
              icon={Users}
              title="Recipient"
              description="Find and request available meals"
              features={[
                "Browse nearby donations on the map",
                "Claim available food with one click",
                "View pickup directions and donor details",
              ]}
              route="/auth?mode=signup&role=recipient"
            />


          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
            Help Food Reach People, Not Landfills
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Start sharing surplus food or finding meals in your local community today.
          </p>
          <Button asChild size="lg" className="bg-card text-foreground hover:bg-card/90">
            <Link to="/auth?mode=signup">Get Started Today</Link>
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SharePlate</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              © 2026 SharePlate. Connecting surplus food with local communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
