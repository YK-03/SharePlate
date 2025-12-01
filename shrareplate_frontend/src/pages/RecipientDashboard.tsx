import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Utensils, MapPin, Clock, CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const userName = localStorage.getItem("userName") || "User";

const RecipientDashboard = () => {
  const [foodList, setFoodList] = useState([
    { id: 1, title: "Fresh Vegetables", donor: "Anita", quantity: "5 kg", status: "Available" },
    { id: 2, title: "Baked Goods", donor: "Rahul", quantity: "20 items", status: "Available" },
    { id: 3, title: "Cooked Meals", donor: "Ramesh", quantity: "10 plates", status: "Available" },
  ]);

  const navigate = useNavigate();

  const handleClaim = (id: number) => {
    const updated = foodList.map((food) =>
      food.id === id ? { ...food, status: "Claimed" } : food
    );
    setFoodList(updated);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 fixed w-full top-0 z-10">
        <h1 className="text-2xl font-semibold text-green-700">SharePlate 🍽️</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome, {userName} 👋</h1>
            <p className="text-muted-foreground text-lg">
              Browse available food donations and claim what you need 🍱
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Claimed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {foodList.filter((f) => f.status === "Claimed").length}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  {foodList.filter((f) => f.status === "Available").length}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent-foreground">⭐ 4.9</div>
              </CardContent>
            </Card>
          </div>

          {/* Available Food List */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Available Donations</CardTitle>
              <CardDescription>Click “Claim” to reserve your food items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {foodList.map((food) => (
                <div
                  key={food.id}
                  className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Utensils className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">{food.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Donor: {food.donor} • {food.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {food.status === "Available" ? (
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleClaim(food.id)}
                      >
                        Claim
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        disabled
                        className="bg-gray-200 text-gray-600 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Claimed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="shadow-card gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm opacity-90">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4" />
                  <p>Pick up your claimed food on time to avoid waste.</p>
                </div>
                <div className="flex gap-2">
                  <Clock className="w-4 h-4" />
                  <p>Check expiry dates before claiming any item.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {foodList
                  .filter((f) => f.status === "Claimed")
                  .map((f) => (
                    <p key={f.id}>✅ You claimed {f.title} from {f.donor}</p>
                  ))}
                {foodList.filter((f) => f.status === "Claimed").length === 0 && (
                  <p>No recent claims yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
