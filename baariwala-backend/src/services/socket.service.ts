import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';

class SocketService {
  private io: Server | null = null;

  public initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      logger.info(`New client connected: ${socket.id}`);

      // Clients join rooms based on salon branch or barber
      socket.on('join_branch_queue', (branchId: string) => {
        socket.join(`branch_${branchId}`);
        logger.info(`Socket ${socket.id} joined branch_${branchId}`);
      });

      socket.on('join_barber_queue', (barberId: string) => {
        socket.join(`barber_${barberId}`);
        logger.info(`Socket ${socket.id} joined barber_${barberId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.IO is not initialized!');
    }
    return this.io;
  }

  // Broadcasters
  public broadcastQueueUpdate(barberId: string, payload: any) {
    if (this.io) {
      this.io.to(`barber_${barberId}`).emit('QUEUE_UPDATED', payload);
    }
  }

  public broadcastBranchQueueUpdate(branchId: string, payload: any) {
    if (this.io) {
      this.io.to(`branch_${branchId}`).emit('BRANCH_QUEUE_UPDATED', payload);
    }
  }
}

export const socketService = new SocketService();
