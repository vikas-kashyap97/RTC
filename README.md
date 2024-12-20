# Real-time Communication App (RTC)

## Overview
**Real-time Communication App (RTC)** is a web-based application that facilitates live voice communication between users. It uses WebRTC for peer-to-peer connections and Socket.IO for real-time signaling. The app supports a user-friendly interface for managing connections, making calls, and interacting with other users.


## Live Demo
Experience the app live [here](https://rtc-voice.netlify.app/).

## GitHub Repository
Explore the source code [here](https://github.com/vikas-kashyap97/RTC.git).

## Project Features
- **Live Voice Communication**: Establish peer-to-peer audio calls between users in real time.
- **User Registration**: Register with a username and peer ID to join the active users list.
- **Dynamic User List**: View and interact with connected users.
- **Incoming Call Notifications**: Receive alerts for incoming call requests.
- **Responsive UI**: Optimized for both desktop and mobile devices.

## Tech Stack
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Frontend**: [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Real-time Communication**: [Socket.IO](https://socket.io/), [WebRTC](https://webrtc.org/)
- **Deployment**: [Netlify](https://www.netlify.com/) for frontend, [Render](https://render.com/) for backend

## Installation and Setup

### Prerequisites
Ensure that **Node.js** and **npm** are installed on your machine.

### Step-by-step Guide
1. **Clone the repository**:
    ```bash
    git clone https://github.com/vikas-kashyap97/RTC.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd RTC
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Set up environment variables**:
    Create a `.env` file in the root directory and specify the following:
    ```env
    PORT=3000
    NODE_ENV=development
    SOCKET_URL=YOUR_RENDER_LINK
    ```

5. **Start the server**:
   - For production:
     ```bash
     npm start
     ```
   - For development:
     ```bash
     npm run dev
     ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` for the backend or visit the live app link for the frontend.

## Project Structure
- **`/src`**: Contains the source code for both frontend and backend.
- **`/backend`**: Node.js and Express server with WebSocket integration.
- **`/frontend`**: React-based user interface built with Vite.
- **`/public`**: Static assets like CSS, JavaScript, and images.
- **`package.json`**: Project metadata, scripts, and dependencies.

## Code Highlights
- **WebSocket Integration**: Used `Socket.IO` for signaling and managing real-time events like user registration and call requests.
- **WebRTC Peer Connections**: Facilitates peer-to-peer audio communication between users.
- **Responsive Design**: Tailored with Tailwind CSS for seamless user experience across devices.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add your message'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

Developed with ❤️ by [Vikas Kashyap](https://github.com/vikas-kashyap97).
