// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCuWTdQuHs_l6rvfzaxvY4y-Uzn0EARRwM",
    authDomain: "athentication-3c73e.firebaseapp.com",
    databaseURL: "https://athentication-3c73e-default-rtdb.firebaseio.com",
    projectId: "athentication-3c73e",
    storageBucket: "athentication-3c73e.appspot.com",
    messagingSenderId: "218346867452",
    appId: "1:218346867452:web:58a57b37f6b6a42ec72579",
    measurementId: "G-3GBM5TSMLS"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Initialize the map
  const mymap = L.map('map').setView([12.986567,79.970969], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mymap);
  
  // Function to plot bicycle on the map
  function plotBicycleOnMap(bicycleNumber, admissionNumber, lat, lng) {
    // Define the custom icon
    const customIcon = L.icon({
      iconUrl: 'marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  
    // Create a marker with the custom icon
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mymap);
  
    // Attach a click event to the marker
    marker.on('click', function () {
      marker.bindPopup(`<b>Bicycle ${bicycleNumber}</b><br>Admission Number: ${admissionNumber}`).openPopup();
    });
  }
  
  // Listen for changes in the Firebase Realtime Database
  firebase.database().ref('bicycles').on('value', (snapshot) => {
    mymap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove(); // Remove existing markers
      }
    });
  
    snapshot.forEach((childSnapshot) => {
      const { admissionNumber, latitude, longitude } = childSnapshot.val();
      plotBicycleOnMap(childSnapshot.key, admissionNumber, latitude, longitude);
    });
  });
  
  // Function to prompt user for bicycle details and store in the database
  function promptForBicycleDetails() {
    // Prompt user for bicycle details
    const bicycleNumber = prompt('Enter Bicycle Number (3 digits):');
    const admissionNumber = prompt('Enter Admission Number:');
  
    if (bicycleNumber && admissionNumber) {
      // Validate bicycle number (3 digits)
      if (/^\d{3}$/.test(bicycleNumber)) {
        // Get current location using Geolocation API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Store data in Firebase Realtime Database
            firebase.database().ref(`bicycles/${bicycleNumber}`).set({
              admissionNumber: admissionNumber,
              latitude: latitude,
              longitude: longitude
            });
            alert('Bicycle location successfully recorded!');
          },
          (error) => {
            console.error('Error getting location:', error.message);
            alert('Error getting location. Please try again or enable location services.');
          }
        );
      } else {
        alert('Invalid Bicycle Number. Please enter a 3-digit number.');
      }
    } else {
      alert('Bicycle details not provided.');
    }
  }
  