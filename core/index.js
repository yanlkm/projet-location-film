// Index.js : Fichier principal pour la configuration et le démarrage du serveur

// Importation des modules nécessaires
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const dbMongo = require('./config/dbMongo'); 
const socketIo = require("socket.io");
const cors = require('cors');
const {
  userJoin,
  formatMessage,
  botName,
  getRoomUsers,
  userLeave,
  getCurrentUser,
} = require("./chat/chatUtils");

// Configuration des variables d'environnement à partir du fichier config.env
dotenv.config({ path: './config/config.env' });

// Initialisation de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware pour autoriser les requêtes CORS
app.use(cors());

// Routes de l'API
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');
const locationsRoute = require('./routes/locations');
const commentRoute = require('./routes/comment');
const movieRoute = require('./routes/movie');
const adminRoute = require('./routes/admin');
const pictureRoute = require('./routes/picture');

// Utilisation des routes définies
app.use('/utilisateurs', usersRoute);
app.use('/auth', authRoute);
app.use('/panier', cartRoute);
app.use('/locations', locationsRoute);
app.use('/commentaires', commentRoute);
app.use('/films', movieRoute);
app.use('/admin', adminRoute);
app.use('/photos', pictureRoute);

// Configuration du port du serveur
const PORT = process.env.PORT || 8080;

// Création du serveur HTTP
const server = http.createServer(app);

// Configuration du serveur de sockets
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "HEADERS"],
  },
});

// Gestion des connexions des clients via les sockets
io.on("connection", (socket) => {

  // Gestion de l'événement 'joinRoom' lorsqu'un utilisateur rejoint une salle de chat
  socket.on("joinRoom", (payload) => {
    const { username, room } = payload;
    
    // Ajout de l'utilisateur à la salle de chat
    const user = userJoin({ ...payload, id: socket.id });
    if (!user) {
      return;
    }

    socket.join(user.room);

    // Émission d'un message pour informer les autres utilisateurs de l'arrivée d'un nouvel utilisateur
    socket.broadcast.to(user.room).emit(
      "message",
      formatMessage(botName, `${user.username} a rejoint le chat`)
    );

    // Envoi de la liste des utilisateurs dans la salle de chat
    const roomUsers = getRoomUsers(user.room);
    if (!roomUsers) {
      return;
    }

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: roomUsers,
    });
  });

  // Gestion de l'événement 'chatMessage' lorsqu'un utilisateur envoie un message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    if (!user) {
      return;
    }

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Gestion de la déconnexion d'un utilisateur
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (!user) {
      return;
    }

    io.to(user.room).emit(
      "message",
      formatMessage(botName, `${user.username} a quitté le chat`)
    );

    // Mise à jour de la liste des utilisateurs dans la salle de chat
    const roomUsers = getRoomUsers(user.room);
    if (!roomUsers) {
      return;
    }

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: roomUsers,
    });
  });
});

// Middleware pour servir le client Socket.IO
app.use('/socket.io', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

// Démarrage du serveur
server.listen(PORT, () => {
});

// Connexion à la base de données MongoDB
dbMongo().then(() => {
}).catch(err => {
});
