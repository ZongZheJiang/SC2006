# SC2006
---

# ParkIt!
**ParkIt!** is a locally hosted web application designed to assist drivers in Singapore by providing real-time updates on carpark availability and pricing. By leveraging APIs like LTA DataMall and HDB Carpark Availability Systems, along with Mapbox for navigation, the app streamlines the process of finding carparks near a desired location.

Demo Video:
https://youtu.be/PZhsPj9tm6c

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
### Carpark Locator

To search for a carpark near your destination, first input the location that you want to head to in the search bar. After that, you will be presented with the 10 nearest carparks to your desired location.

<img width="400" src="https://github.com/user-attachments/assets/7a636854-5183-4a6a-8569-df7e08fa1c9f">
<img width="400" src="https://github.com/user-attachments/assets/d13a4cce-573d-4fc4-8825-a201285bda8f">

---

### Navigation

After Selecting a desired carpark, you will be given navigation routes to your selected carpark.

<img width="400" src="https://github.com/user-attachments/assets/90c806e3-ccd8-4f20-87c9-578210ebdc18">

---
### Bookmarking Carparks
If you want to save a carpark for future reference, you can either click the bookmark button beside the desired carpark, or you can go to the bookmarks tab, input the location that you want to save, and click 'add to bookmarks'. After that, whenever you open the app, you can simply just head to the bookmarks page of the app and click the navigate button to navigate to your desired carpark.

<img width="400" src="https://github.com/user-attachments/assets/04622299-4181-4d4b-8eeb-41ac6e508c9c">

---
### Settings for customisation
If you are not seeing the results you want to see, you may head to the settings page to tailor your experience and show the results based on either price, proximity or lot availability. you can also use this to change the app to search for motorcycle parking instead by clicking the motorcycle button. For EV drivers, theres even a show EV parking button to highlight which parking lots have EV charging capabilities.

<img width="400" src="https://github.com/user-attachments/assets/6c1168c4-e370-404a-96fa-6ff098d03ccc">

---
These core features work together to provide a seamless and efficient parking experience, addressing the unique challenges faced by drivers in Singapore.
