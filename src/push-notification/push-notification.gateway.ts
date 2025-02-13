import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Autorise toutes les origines (à sécuriser en prod)
  },
})
export class PushNotificationGateway {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
    
    // Supprimer le socket de la liste quand il se déconnecte
    this.clients.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.clients.delete(userId);
      }
    });
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    if (!data.userId) {
      console.error('Erreur : userId manquant');
      return;
    }

    this.clients.set(data.userId, client.id);
    console.log(`Utilisateur ${data.userId} enregistré avec le socket ${client.id}`);
  }

  @SubscribeMessage('send-notification')
  handleSendNotification(@MessageBody() data: { userId: string; title: string; message: string }) {
    console.log(`Tentative d'envoi à ${data.userId}`);

    const socketId = this.clients.get(data.userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', {
        title: data.title,
        message: data.message,
      });
      console.log(`✅ Notification envoyée à ${data.userId}`);
    } else {
      console.warn(`⚠️ Utilisateur ${data.userId} non connecté.`);
    }
  }
}


// import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*', // Sécuriser en production
//   },
// })
// export class PushNotificationGateway {
//   @WebSocketServer()
//   server: Server;

//   private clients = new Map<string, string>(); // userId -> socketId

//   handleConnection(client: Socket) {
//     console.log(`Client connecté : ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client déconnecté : ${client.id}`);
//     this.clients.forEach((socketId, userId) => {
//       if (socketId === client.id) {
//         this.clients.delete(userId);
//       }
//     });
//   }

//   @SubscribeMessage('register')
//   handleRegister(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
//     if (!data.userId) {
//       console.error('Erreur : userId manquant');
//       return;
//     }
//     this.clients.set(data.userId, client.id);
//     console.log(`Utilisateur ${data.userId} enregistré avec le socket ${client.id}`);
//   }

//   @SubscribeMessage('send-message')
//   handleSendMessage(@MessageBody() data: { from: string; to: string; message: string }) {
//     console.log(`Message de ${data.from} à ${data.to}: ${data.message}`);

//     const socketId = this.clients.get(data.to);
//     if (socketId) {
//       this.server.to(socketId).emit('receive-message', {
//         from: data.from,
//         message: data.message,
//       });
//     } else {
//       console.warn(`⚠️ Utilisateur ${data.to} non connecté.`);
//     }
//   }
// }
