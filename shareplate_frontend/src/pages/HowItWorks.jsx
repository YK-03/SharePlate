import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, HeartHandshake, Utensils, ShieldCheck, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: Utensils,
      title: "1. Donors Post Food",
      description: "List extra food with pickup details.",
      features: [
        "Specify meal portions and best-before date",
        "Set pickup address and available times",
        "Add food handling and packaging notes",
        "Listings appear immediately for local recipients"
      ]
    },
    {
      icon: Users,
      title: "2. Recipients Claim Meals",
      description: "Browse nearby food and reserve portions.",
      features: [
        "Browse available food on an interactive map",
        "Claim meals before expiration",
        "View donor contact info and pickup address",
        "Get driving directions and routes via OSRM"
      ]
    },
    {
      icon: HeartHandshake,
      title: "3. Pickup & Confirmation",
      description: "Collect food and confirm handover.",
      features: [
        "Pick up food directly from the donor",
        "Coordinate timing directly if needed",
        "Confirm receipt on the dashboard",
        "Keep records of completed community handovers"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Increased padding for clear visibility */}
      <section className="relative pt-20 pb-20 overflow-hidden text-center flex-grow-0">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <br />
            <br />
            How SharePlate <br />
            <span className="gradient-primary bg-clip-text text-transparent">
              Works
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            A simple, transparent process connecting surplus food with people who need it.
          </p>
        </div>
      </section>
      <br />
      {/* Steps Grid */}
      <section className="py-10 pb-32 px-4 flex-grow">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 border-2 border-transparent hover:border-primary/50 bg-white">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-primary mt-0.5">
                          <Check className="w-5 h-5" />
                        </span>
                        <span className="text-base text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">SharePlate</span>
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

export default HowItWorks;
