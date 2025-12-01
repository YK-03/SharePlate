import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  route: string;
}

const RoleCard = ({ icon: Icon, title, description, features, route }: RoleCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
      <CardHeader>
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 animate-float">
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="default" size="lg" className="w-full">
          <Link to={route}>Get Started as {title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
