import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://rtc-voice.netlify.app/']
    : ['http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Active users store
const activeUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user:register', ({ peerId, username }) => {
    activeUsers.set(socket.id, { peerId, username });
    io.emit('users:update', Array.from(activeUsers.values()));
  });

  socket.on('call:request', ({ to, from }) => {
    const targetSocket = Array.from(activeUsers.entries())
      .find(([_, user]) => user.peerId === to)?.[0];
    
    if (targetSocket) {
      io.to(targetSocket).emit('call:incoming', { from });
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('users:update', Array.from(activeUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});