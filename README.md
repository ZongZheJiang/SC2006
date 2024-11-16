# SC2006
---

# ParkIt!
**ParkIt!** is a locally hosted web application designed to assist drivers in Singapore by providing real-time updates on carpark availability and pricing. By leveraging APIs like LTA DataMall and HDB Carpark Availability Systems, along with Mapbox for navigation, the app streamlines the process of finding carparks near a desired location.

---

## Features
- **Search Nearby Carparks**: Input a location to find carparks near your destination.
- **Real-Time Updates**: Access live carpark availability and pricing data.
- **Navigation**: Get directions to your chosen carpark with an interactive map.
- **Sorting Options**: Sort carparks based on proximity or pricing.
- **Bookmarking**: Save favorite locations for easy access in future sessions.

---

## Steps to Run the Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Navigate to the backend directory:
   ```bash
   cd backend
   ```
4. Start the backend server:
   ```bash
   python app.py
   ```
5. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
6. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
7. Start the frontend server:
   ```bash
   npm start
   ```

Once the app is running, open your browser and navigate to `http://localhost:3000` to access **ParkIt!**.
---
### User Manual for **ParkIt!**

---

### **Core Features of ParkIt!**

---

### **1. Carpark Locator**
The **Carpark Locator** is the central feature of **ParkIt!**. It enables users to:
- Search for parking lots near their desired destination.
- View real-time availability and pricing information.
- Identify carparks optimized for cars or motorcycles, based on the selected mode.
- See carparks with EV charging stations if the EV sorting option is toggled.

The locator provides an interactive map powered by Mapbox, allowing users to explore their surroundings and navigate seamlessly to their chosen carpark.

---

### **2. Bookmarking Carparks**
The **Bookmarking** feature allows users to save their frequently used or favorite carparks for quick access.  
- Users can add carparks to their bookmarks from the main search page.
- Saved carparks appear in the dedicated bookmarks page, where they can be easily accessed or removed.
This feature ensures that users can revisit their preferred locations without re-entering search details, saving time and effort.

---

### **3. Navigation**
The **Navigation** feature integrates with Mapbox to provide turn-by-turn directions to the selected carpark.  
- Users can select a carpark from the search results or bookmarks page to generate a route.
- The map interface allows zooming in and out, giving users a clear understanding of their surroundings.
This feature makes it easy to reach the chosen carpark with minimal effort.

---

### **4. Settings for Customization**
The **Settings** page empowers users to tailor their experience by offering the following options:
- **Mode Selection**: Switch between **Motorcycle Mode** and **Car Mode** to locate parking lots specific to cars or motorcycles.
- **Sorting Options**:
  - **Proximity**: Lists carparks closest to the destination first.
  - **Lot Availability**: Prioritizes carparks with the most vacant spaces.
  - **Price**: Highlights the cheapest carparks.
- **EV Sorting Options**: Enables filtering to display carparks equipped with EV charging stations.
- **Search Radius**: Allows users to define a maximum distance (e.g., 1 km, 5 km) for displayed carparks, ensuring results are relevant to their needs.

These customizations ensure that **ParkIt!** caters to diverse user preferences and scenarios, making the app highly adaptable and user-friendly. 

--- 

These core features work together to provide a seamless and efficient parking experience, addressing the unique challenges faced by drivers in Singapore.
