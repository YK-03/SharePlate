import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Users, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveAuthToken } from "@/lib/api";

type UserRole = "donor" | "recipient" | "volunteer" | null;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");


  const navigate = useNavigate();

  const roles = [
    { id: "donor" as const, label: "Donor", icon: UtensilsCrossed },
    { id: "recipient" as const, label: "Recipient", icon: Users },

  ];

  // ⭐ SIGNUP HANDLER (Role Pass)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    try {
      const { token, user } = await api.registerUser({
        email,
        password,
        role: selectedRole,
        first_name: fullName.split(" ")[0],
        last_name: fullName.split(" ").slice(1).join(" "),
      });
      saveAuthToken(token);
      alert("Signed up successfully!");

      switch (user.role) {
        case "donor":
          navigate("/donor");
          break;

        case "recipient":
          navigate("/recipient");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please check your details.");
    }
  };

  const handleLogin = async () => {
    try {
      const { token, user } = await api.loginUser(email, password);
      saveAuthToken(token);
      alert("Logged in successfully!");

      switch (user.role) {
        case "donor":
          navigate("/donor");
          break;

        case "recipient":
          navigate("/recipient");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated relative">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SharePlate</span>
          </Link>

          <CardTitle className="text-2xl">
            {isSignUp ? "Join Our Community" : "Login to Continue"}
          </CardTitle>

          <CardDescription>
            {isSignUp
              ? "Create your account and start helping others"
              : "Enter your details to access your dashboard"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* SIGNUP FORM */}
          {isSignUp ? (
            <form onSubmit={handleSignup} className="space-y-6">
              {/* ROLE SELECT */}
              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      type="button"
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${selectedRole === role.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                        }`}
                    >
                      <role.icon className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <div className="text-xs font-medium">{role.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* FULL NAME */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={!selectedRole}
              >
                Create Account
              </Button>
            </form>
          ) : (
            /* LOGIN FORM */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                onClick={handleLogin}
                variant="hero"
                size="lg"
                className="w-full"
              >
                Login
              </Button>
            </div>
          )}

          {/* SWITCH BUTTON */}
          <div className="text-center text-sm mt-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp
                ? "Already have an account? Login"
                : "New here? Join Now"}
            </button>
          </div>
        </CardContent>.
      </Card>
    </div>
  );
};

export default Auth;
