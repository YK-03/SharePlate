import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, MapPin, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, type DonationItem } from "@/lib/api";
import { toast } from "sonner";

const userName = localStorage.getItem("userName") || "User";

const RecipientDashboard = () => {
  const [availableDonations, setAvailableDonations] = useState<DonationItem[]>([]);
  const [myClaims, setMyClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donations, claims] = await Promise.all([
        api.getDonations(),
        api.getRequests(),
      ]);
      setAvailableDonations(donations);
      setMyClaims(claims);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ check if THIS user claimed this donation
  const hasUserClaimed = (donationId: number) => {
    return myClaims.some(
      (claim) => claim.item_details?.id === donationId
    );
  };

  // 🟢 CLAIM = ORDER PLACE
  const handleClaim = async (id: number) => {
    try {
      await api.createRequest(id);
      toast.success("✅ Order Confirmed! Please wait for donor approval");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to claim donation");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 fixed w-full top-0 z-10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-semibold text-green-700 cursor-pointer hover:text-green-800 transition"
        >
          SharePlate 🍽️
        </h1>

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
            <Card>
              <CardHeader>
                <CardTitle>Total Claimed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myClaims.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{availableDonations.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">⭐ 4.9</div>
              </CardContent>
            </Card>
          </div>

          {/* AVAILABLE DONATIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Available Donations</CardTitle>
              <CardDescription>Click “Claim” to place order</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {loading ? (
                <p>Loading donations...</p>
              ) : availableDonations.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No donations available
                </p>
              ) : (
                availableDonations.map((food) => {
                  const claimedByMe = hasUserClaimed(food.id);

                  // 🔥 FINAL DECISION
                  const isAlreadyClaimed =
                    claimedByMe || food.is_available === false;

                  return (
                    <div
                      key={food.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div className="flex gap-4">
                        <Utensils className="text-green-600" />
                        <div>
                          <h3 className="font-semibold">{food.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {food.quantity} items • Expires: {food.expiry_date}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {food.address}
                          </p>
                        </div>
                      </div>

                      {/* ✅ FINAL UI */}
                      {isAlreadyClaimed ? (
                        <span className="text-gray-500 font-semibold">
                          Claimed
                        </span>
                      ) : (
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleClaim(food.id)}
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* ORDER TRACKING */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                {myClaims.length === 0 ? (
                  <p>No recent orders</p>
                ) : (
                  myClaims.map((claim) => (
                    <p key={claim.id}>
                      🍱 {claim.item_details?.name} —
                      <b>
                        {claim.status === "PENDING" && " Order Confirmed"}
                        {claim.status === "ACCEPTED" && " Food Ready"}
                        {claim.status === "PICKED_UP" && " On the way"}
                        {claim.status === "COMPLETED" && " Delivered"}
                      </b>
                    </p>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex gap-2">
                  <MapPin className="w-4 h-4" /> Reach pickup location on time
                </p>
                <p className="flex gap-2">
                  <Clock className="w-4 h-4" /> Check expiry before pickup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
