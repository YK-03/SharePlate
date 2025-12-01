import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MapPin, Truck, Clock, Package, CheckCircle2, Users } from "lucide-react";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const [requests, setRequests] = useState([
    {
      id: 1,
      recipient: "Ramesh",
      pickup: "Hotel Green, Indirapuram",
      delivery: "Sector 63, Noida",
      food: "Rice Packets",
      status: "Pending",
    },
    {
      id: 2,
      recipient: "Anita",
      pickup: "Bakery Bliss, Ghaziabad",
      delivery: "Vasundhara",
      food: "Sandwich Boxes",
      status: "Picked",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Volunteer Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Manage your food pickup and delivery assignments
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg text-gray-700 font-medium">
                Welcome, {userName} 👋
              </span>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/auth");
                }}
                className="bg-[#22c55e] text-white px-4 py-2 rounded-lg hover:bg-[#16a34a] transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">3</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">14</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours Volunteered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent-foreground">48h</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content + Sidebar */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Delivery List */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Pickup Requests</CardTitle>
                  <CardDescription>Track and update your assigned deliveries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{req.food}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Package className="w-4 h-4 text-primary" /> Pickup: {req.pickup}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" /> Deliver: {req.delivery}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            req.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : req.status === "Picked"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {req.status === "Pending" && (
                          <Button
                            variant="default"
                            className="flex-1"
                            onClick={() =>
                              setRequests((prev) =>
                                prev.map((r) =>
                                  r.id === req.id ? { ...r, status: "Picked" } : r
                                )
                              )
                            }
                          >
                            <Truck className="w-4 h-4 mr-2" /> Mark as Picked
                          </Button>
                        )}
                        {req.status !== "Delivered" && (
                          <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() =>
                              setRequests((prev) =>
                                prev.map((r) =>
                                  r.id === req.id ? { ...r, status: "Delivered" } : r
                                )
                              )
                            }
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-card gradient-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" /> Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold mb-1">48h</div>
                    <div className="text-sm opacity-90">Hours volunteered this month</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">14</div>
                    <div className="text-sm opacity-90">Successful deliveries</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p>Update delivery status on time</p>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p>Verify recipient address before pickup</p>
                  </div>
                  <div className="flex gap-2">
                    <Truck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p>Ensure safe food transport and hygiene</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
