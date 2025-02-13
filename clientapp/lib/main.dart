import 'package:flutter/material.dart';
import 'services/socket_service.dart';  

void main() {
  runApp(ChatApp());
}

class ChatApp extends StatefulWidget {
  const ChatApp({super.key});

  @override
  _ChatAppState createState() => _ChatAppState();
}

class _ChatAppState extends State<ChatApp> {
  final SocketService socketService = SocketService();
  final TextEditingController messageController = TextEditingController();
  final String userId = "user123"; // ID de l'utilisateur actuel
  final String recipientId = "user456"; // ID du destinataire
  List<String> messages = [];

  @override
  void initState() {
    super.initState();
    socketService.connect(userId);
    socketService.listenForMessages((from, message) {
      setState(() {
        messages.add("De $from : $message");
      });

      // Supprimer le message après 10 secondes
      Future.delayed(Duration(seconds: 10), () {
        setState(() {
          messages.remove("De $from : $message");
        });
      });
    });
  }

  void sendMessage() {
    String message = messageController.text;
    if (message.isNotEmpty) {
      socketService.sendMessage(userId, recipientId, message);
      setState(() {
        messages.add("Moi : $message");
      });

      // Supprimer le message après 10 secondes
      Future.delayed(Duration(seconds: 10), () {
        setState(() {
          messages.remove("Moi : $message");
        });
      });

      messageController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("Chat Éphémère")),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  return ListTile(title: Text(messages[index]));
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: messageController,
                      decoration: InputDecoration(labelText: "Message"),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.send),
                    onPressed: sendMessage,
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    socketService.disconnect();
    super.dispose();
  }
}
