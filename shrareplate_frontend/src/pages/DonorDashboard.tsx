import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import {
  UtensilsCrossed,
  Plus,
  Package,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { initAutocomplete, geocodeAddress } from "@/lib/geocoding";
import { api, type DonationItem, type CreateDonationData } from "@/lib/api";

// Helper function to normalize donation data from different sources
const normalizeDonation = (donation: any) => {
  return {
    id: donation.id,
    title: donation.title || donation.name || 'Untitled',
    name: donation.name || donation.title || 'Untitled',
    quantity: donation.quantity,
    expiry: donation.expiry || donation.expiry_date,
    expiry_date: donation.expiry_date || donation.expiry,
    location: donation.location || donation.address,
    address: donation.address || donation.location,
    lat: donation.lat || donation.latitude,
    lng: donation.lng || donation.longitude,
    latitude: donation.latitude || donation.lat,
    longitude: donation.longitude || donation.lng,
    description: donation.description || '',
    status: donation.status || (donation.is_available ? 'Active' : 'Inactive'),
    is_available: donation.is_available !== undefined ? donation.is_available : true,
    matched: donation.matched || false,
    createdAt: donation.createdAt || donation.created_at,
    created_at: donation.created_at || donation.createdAt,
    donor: donation.donor || 'Unknown',
  };
};

const DonorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const editLocationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteCleanupRef = useRef<(() => void) | null>(null);
  const editAutocompleteCleanupRef = useRef<(() => void) | null>(null);

  // Initialize autocomplete for location input
  useEffect(() => {
    if (!showForm) return;

    // Small delay to ensure input is rendered
    const timer = setTimeout(() => {
      if (!locationInputRef.current) return;

      const cleanup = initAutocomplete(locationInputRef.current, (place) => {
        // Store the coordinates in a data attribute for later use
        if (locationInputRef.current) {
          locationInputRef.current.setAttribute('data-lat', place.lat.toString());
          locationInputRef.current.setAttribute('data-lng', place.lng.toString());
          locationInputRef.current.setAttribute('data-place-id', place.placeId || '');
        }
      });

      autocompleteCleanupRef.current = cleanup;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (autocompleteCleanupRef.current) {
        autocompleteCleanupRef.current();
        autocompleteCleanupRef.current = null;
      }
    };
  }, [showForm]);

  // Initialize autocomplete for edit modal location input
  useEffect(() => {
    if (!showModal) return;

    // Small delay to ensure input is rendered in modal
    const timer = setTimeout(() => {
      if (!editLocationInputRef.current) return;

      const cleanup = initAutocomplete(editLocationInputRef.current, (place) => {
        if (editLocationInputRef.current) {
          editLocationInputRef.current.setAttribute('data-lat', place.lat.toString());
          editLocationInputRef.current.setAttribute('data-lng', place.lng.toString());
          editLocationInputRef.current.setAttribute('data-place-id', place.placeId || '');
        }
      });

      editAutocompleteCleanupRef.current = cleanup;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (editAutocompleteCleanupRef.current) {
        editAutocompleteCleanupRef.current();
        editAutocompleteCleanupRef.current = null;
      }
    };
  }, [showModal]);

  // Load donations from backend API
  useEffect(() => {
    const loadDonations = async () => {
      try {
        const backendDonations = await api.getDonations();
        // Normalize donations to ensure consistent format
        const normalized = backendDonations.map(normalizeDonation);
        setDonations(normalized);
      } catch (error) {
        console.error("Failed to load donations from backend:", error);
        // Fallback to localStorage if backend fails
        const saved = localStorage.getItem("donations");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const normalized = parsed.map(normalizeDonation);
            setDonations(normalized);
          } catch (e) {
            console.error("Failed to parse donations from localStorage:", e);
          }
        }
      }
    };
    
    loadDonations();
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    if (donations.length > 0) {
      localStorage.setItem("donations", JSON.stringify(donations));
    }
  }, [donations]);

  // Handle scrolling to map when selectedDonation changes
  useEffect(() => {
    if (!selectedDonation) {
      return;
    }
    const normalized = normalizeDonation(selectedDonation);
    const lat = normalized.lat || normalized.latitude;
    const lng = normalized.lng || normalized.longitude;
    
    if (!lat || !lng) {
      return;
    }

    let retryInterval: NodeJS.Timeout | null = null;
    let animationFrameId: number | null = null;
    let isCleanedUp = false;

    // Use requestAnimationFrame to wait for the next render cycle
    const scrollToMap = () => {
      if (isCleanedUp) return;
      
      const mapElement = document.getElementById('donation-map');
      if (mapElement) {
        // Use requestAnimationFrame to ensure the map is fully rendered
        animationFrameId = requestAnimationFrame(() => {
          if (isCleanedUp) return;
          animationFrameId = requestAnimationFrame(() => {
            if (isCleanedUp) return;
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        });
      } else {
        // Retry if element doesn't exist yet (with a max retry limit)
        let retryCount = 0;
        const maxRetries = 10;
        retryInterval = setInterval(() => {
          if (isCleanedUp) {
            if (retryInterval) clearInterval(retryInterval);
            return;
          }
          
          retryCount++;
          const element = document.getElementById('donation-map');
          if (element) {
            if (retryInterval) clearInterval(retryInterval);
            retryInterval = null;
            animationFrameId = requestAnimationFrame(() => {
              if (!isCleanedUp) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
          } else if (retryCount >= maxRetries) {
            if (retryInterval) clearInterval(retryInterval);
            retryInterval = null;
            console.warn('Map element not found after retries');
          }
        }, 50);
      }
    };

    // Small delay to allow React to start rendering
    const timer = setTimeout(scrollToMap, 50);
    
    return () => {
      isCleanedUp = true;
      clearTimeout(timer);
      if (retryInterval) {
        clearInterval(retryInterval);
        retryInterval = null;
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [selectedDonation?.id, selectedDonation?.lat, selectedDonation?.lng]);

  const handleAddDonation = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const locationText = form.location.value;
    
    if (!locationText) {
      toast.error("Please enter a pickup location");
      return;
    }

    setIsGeocoding(true);
    
    try {
      let lat: number | null = null;
      let lng: number | null = null;
      let formattedAddress = locationText;

      // Check if coordinates are already available from autocomplete
      const locationInput = locationInputRef.current;
      if (locationInput) {
        const dataLat = locationInput.getAttribute('data-lat');
        const dataLng = locationInput.getAttribute('data-lng');
        
        if (dataLat && dataLng) {
          lat = parseFloat(dataLat);
          lng = parseFloat(dataLng);
          formattedAddress = locationInput.value;
        }
      }

      // If no coordinates from autocomplete, try geocoding
      if (lat === null || lng === null) {
        try {
          const geocodeResult = await geocodeAddress(locationText);
          lat = geocodeResult.lat;
          lng = geocodeResult.lng;
          formattedAddress = geocodeResult.formattedAddress;
        } catch (geocodeError) {
          console.warn("Geocoding failed, saving without coordinates:", geocodeError);
          toast.warning("Location saved, but coordinates could not be determined. Map may not display correctly.");
        }
      }

      // Prepare donation data for backend
      const donationData: CreateDonationData = {
        name: form.foodType.value,
        description: form.description.value || '',
        quantity: parseInt(form.quantity.value) || 1,
        expiry_date: form.expiry.value,
        address: formattedAddress,
        ...(lat && lng && { latitude: lat, longitude: lng }),
      };

      // Try to create donation via backend API
      let newDonation;
      try {
        const createdDonation = await api.createDonation(donationData);
        newDonation = normalizeDonation(createdDonation);
        setDonations([...donations, newDonation]);
        toast.success("Donation posted successfully ✅ Volunteers have been notified!");
      } catch (apiError) {
        console.error("Backend API error:", apiError);
        // Fallback to localStorage if backend fails
        newDonation = normalizeDonation({
          id: Date.now(),
          name: form.foodType.value,
          title: form.foodType.value,
          quantity: form.quantity.value,
          expiry_date: form.expiry.value,
          expiry: form.expiry.value,
          location: locationText,
          address: formattedAddress,
          lat: lat,
          lng: lng,
          latitude: lat,
          longitude: lng,
          description: form.description.value,
          is_available: true,
          status: "Active",
          matched: false,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString(),
          donor: 'You',
        });
        setDonations([...donations, newDonation]);
        toast.success("Donation saved locally (backend unavailable)");
      }

      form.reset();
      setShowForm(false);
      
      // Clear autocomplete data attributes
      if (locationInputRef.current) {
        locationInputRef.current.removeAttribute('data-lat');
        locationInputRef.current.removeAttribute('data-lng');
        locationInputRef.current.removeAttribute('data-place-id');
      }

      // Show the map with the new donation
      setSelectedDonation(normalizeDonation(newDonation));
      
    } catch (error) {
      console.error("Error adding donation:", error);
      toast.error("Failed to post donation. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this donation?")) {
      setDonations(donations.filter((d) => d.id !== id));
      // Clear selected donation if it was deleted
      if (selectedDonation && selectedDonation.id === id) {
        setSelectedDonation(null);
      }
      toast.success("Donation deleted successfully 🗑️");
    }
  };

  const handleViewMap = (donation: any) => {
    setSelectedDonation(normalizeDonation(donation));
    // Scrolling is now handled by the useEffect that watches selectedDonation
    // This ensures the DOM is updated and the map is rendered before scrolling
  };

  const handleEdit = (donation: any) => {
    setEditingDonation(normalizeDonation(donation));
    setShowModal(true);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const locationText = form.location.value;
    
    setIsGeocoding(true);

    try {
      const normalizedEdit = normalizeDonation(editingDonation);
      let lat: number | null = normalizedEdit.lat || normalizedEdit.latitude || null;
      let lng: number | null = normalizedEdit.lng || normalizedEdit.longitude || null;
      let formattedAddress = locationText;

      // Check if coordinates are available from autocomplete
      const locationInput = editLocationInputRef.current;
      if (locationInput) {
        const dataLat = locationInput.getAttribute('data-lat');
        const dataLng = locationInput.getAttribute('data-lng');
        
        if (dataLat && dataLng) {
          lat = parseFloat(dataLat);
          lng = parseFloat(dataLng);
          formattedAddress = locationInput.value;
        }
      }

      // If location changed and no coordinates, try geocoding
      if (locationText !== (normalizedEdit.location || normalizedEdit.address) && (lat === null || lng === null)) {
        try {
          const geocodeResult = await geocodeAddress(locationText);
          lat = geocodeResult.lat;
          lng = geocodeResult.lng;
          formattedAddress = geocodeResult.formattedAddress;
        } catch (geocodeError) {
          console.warn("Geocoding failed:", geocodeError);
        }
      }

      const updatedDonationData = {
        ...editingDonation,
        title: form.foodType.value,
        name: form.foodType.value,
        quantity: form.quantity.value,
        expiry: form.expiry.value,
        expiry_date: form.expiry.value,
        location: locationText,
        address: formattedAddress,
        lat: lat,
        lng: lng,
        latitude: lat,
        longitude: lng,
        description: form.description.value,
      };
      
      const updated = donations.map((d) =>
        d.id === editingDonation.id ? normalizeDonation(updatedDonationData) : d
      );
      setDonations(updated);
      setShowModal(false);
      
      // Clear autocomplete data attributes
      if (editLocationInputRef.current) {
        editLocationInputRef.current.removeAttribute('data-lat');
        editLocationInputRef.current.removeAttribute('data-lng');
        editLocationInputRef.current.removeAttribute('data-place-id');
      }

      // Update selected donation if it's the one being edited
      if (selectedDonation && selectedDonation.id === editingDonation.id) {
        const updatedDonation = updated.find(d => d.id === editingDonation.id);
        setSelectedDonation(updatedDonation ? normalizeDonation(updatedDonation) : null);
      }

      toast.success("Donation updated successfully 🎉");
    } catch (error) {
      console.error("Error updating donation:", error);
      toast.error("Failed to update donation. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const filteredDonations = donations
    .map(normalizeDonation)
    .filter((donation) => {
      const matchesSearch =
        (donation.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donation.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "All" || donation.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

  const handleLogout = () => {
    localStorage.removeItem("userName");
    toast.success("Logged out successfully 👋");
    setTimeout(() => (window.location.href = "/auth"), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Donor Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Manage your food donations and make an impact
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {donations.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Meals Provided
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">156</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent-foreground">
                  {
                    donations.filter((d) => d.status === "Active").length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Impact Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">⭐ 4.8</div>
              </CardContent>
            </Card>
          </div>

          {/* Add Donation */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Post New Donation</CardTitle>
                  <CardDescription>
                    Share your surplus food with the community
                  </CardDescription>
                </div>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => setShowForm(!showForm)}
                >
                  <Plus className="w-4 h-4" />
                  New Donation
                </Button>
              </div>
            </CardHeader>

            {showForm && (
              <CardContent className="space-y-4 animate-slide-up">
                <form onSubmit={handleAddDonation}>
                  <div className="space-y-2">
                    <Label>Food Type</Label>
                    <Input name="foodType" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input name="quantity" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Best Before</Label>
                      <Input type="date" name="expiry" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Pickup Location
                    </Label>
                    <Input 
                      id="location"
                      name="location" 
                      ref={locationInputRef}
                      placeholder="Start typing an address..."
                      required 
                      disabled={isGeocoding}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Start typing to search for addresses
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" rows={4} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button type="submit" className="flex-1" disabled={isGeocoding}>
                      <Package className="w-4 h-4" />
                      {isGeocoding ? "Processing..." : "Post Donation"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowForm(false);
                        if (locationInputRef.current) {
                          locationInputRef.current.removeAttribute('data-lat');
                          locationInputRef.current.removeAttribute('data-lng');
                          locationInputRef.current.removeAttribute('data-place-id');
                        }
                      }}
                      disabled={isGeocoding}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search donations..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                className="border rounded-md p-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Active</option>
                <option>Matched</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {/* Map Display */}
          {(() => {
            if (!selectedDonation) return null;
            const donation = normalizeDonation(selectedDonation);
            const lat = donation.lat || donation.latitude;
            const lng = donation.lng || donation.longitude;
            
            if (!lat || !lng) return null;
            
            return (
              <Card className="shadow-card mb-8" id="donation-map">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary" />
                        Pickup Location
                      </CardTitle>
                      <CardDescription>
                        {donation.title} - {donation.address || donation.location}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDonation(null)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Map
                    locations={[{
                      lat: lat,
                      lng: lng,
                      name: donation.title,
                      title: donation.title,
                      description: `${donation.quantity} • Exp: ${donation.expiry}`,
                      address: donation.address || donation.location,
                    }]}
                    center={[lat, lng]}
                    zoom={15}
                    height="400px"
                  />
                </CardContent>
              </Card>
            );
          })()}

          {/* Donation List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Donations</CardTitle>
              <CardDescription>
                Track, edit or remove your donations easily
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredDonations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No donations found.
                </p>
              ) : (
                filteredDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="p-4 rounded-lg border hover:border-primary/50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {donation.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {donation.quantity} • {donation.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Exp: {donation.expiry}
                        </p>
                        {donation.lat && donation.lng && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Location verified
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {donation.lat && donation.lng && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMap(donation)}
                            className="flex items-center gap-1"
                          >
                            <MapPin className="w-4 h-4" />
                            View Map
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(donation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(donation.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Donation</h2>
                  <Button variant="ghost" onClick={() => setShowModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                  {(() => {
                    const normalized = editingDonation ? normalizeDonation(editingDonation) : null;
                    if (!normalized) return null;
                    
                    return (
                      <>
                        <div className="space-y-2">
                          <Label>Food Type</Label>
                          <Input
                            name="foodType"
                            defaultValue={normalized.title || normalized.name}
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              name="quantity"
                              defaultValue={normalized.quantity}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Best Before</Label>
                            <Input
                              type="date"
                              name="expiry"
                              defaultValue={normalized.expiry || normalized.expiry_date}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-location">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Pickup Location
                          </Label>
                          <Input
                            id="edit-location"
                            name="location"
                            ref={editLocationInputRef}
                            defaultValue={normalized.location || normalized.address}
                            placeholder="Start typing an address..."
                            required
                            disabled={isGeocoding}
                          />
                          <p className="text-xs text-muted-foreground">
                            💡 Start typing to search for addresses
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            name="description"
                            defaultValue={normalized.description}
                            rows={4}
                          />
                        </div>
                      </>
                    );
                  })()}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowModal(false);
                        if (editLocationInputRef.current) {
                          editLocationInputRef.current.removeAttribute('data-lat');
                          editLocationInputRef.current.removeAttribute('data-lng');
                          editLocationInputRef.current.removeAttribute('data-place-id');
                        }
                      }}
                      disabled={isGeocoding}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-green-600 text-white"
                      disabled={isGeocoding}
                    >
                      {isGeocoding ? "Updating..." : "Update Donation"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
