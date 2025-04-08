function setupSocketIO(io) {
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
  
      socket.on('joinParcelRoom', (parcelId) => {
        socket.join(parcelId);
        console.log(`📦 Socket ${socket.id} joined parcel room: ${parcelId}`);
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  
  module.exports = { setupSocketIO };