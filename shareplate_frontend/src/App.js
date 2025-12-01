import React from 'react';
import Map from './components/Map'; // <-- This line imports the map component
// If you have a global CSS file, you can import it here
// import './App.css';

function App() {
  // Sample data for donation locations. Later, this will be fetched from your API.
  const sampleLocations = [
    { lat: 28.6139, lng: 77.2090, name: "Donation Center, Delhi" },
    { lat: 19.0760, lng: 72.8777, name: "Food Bank, Mumbai" },
    { lat: 12.9716, lng: 77.5946, name: "Community Kitchen, Bangalore" },
    { lat: 22.5726, lng: 88.3639, name: "Nourish Point, Kolkata" },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to SharePlate</h1>
        <p>Find donation locations near you.</p>
      </header>
      <main>
        {/* Pass the locations to the Map component */}
        <Map locations={sampleLocations} />
      </main>
    </div>
  );
}

export default App;
