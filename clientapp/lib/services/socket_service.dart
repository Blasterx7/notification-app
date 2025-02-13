import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;

  void connect(String userId) {
    socket = IO.io('http://localhost:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((_) {
      debugPrint('Connecté au serveur WebSocket');
      socket.emit('register', {'userId': userId});
    });

    socket.onDisconnect((_) => debugPrint('Déconnecté du serveur WebSocket'));
  }

  void sendMessage(String from, String to, String message) {
    socket.emit('send-message', {'from': from, 'to': to, 'message': message});
  }

  void listenForMessages(Function(String from, String message) onMessageReceived) {
    socket.on('receive-message', (data) {
      onMessageReceived(data['from'], data['message']);
    });

    socket.on('delete-message', (data) {
      debugPrint("Message de ${data['from']} supprimé");
    });
  }

  void disconnect() {
    socket.disconnect();
  }
}
