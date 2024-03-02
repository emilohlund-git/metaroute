import { Injectable } from "@core/common/decorators/injectable.decorator";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { Socket } from "socket.io";

export interface Session {
  participants: string[];
}

export class RequestOfferDto {
  public sessionId: string = undefined as any;
  public offer: RTCSessionDescriptionInit = undefined as any;
}

export class RequestAnswerDto {
  public sessionId: string = undefined as any;
  public answer: RTCSessionDescriptionInit = undefined as any;
}

export class RequestCandidateDto {
  public sessionId: string = undefined as any;
  public candidate: RTCIceCandidateInit = undefined as any;
}

@Injectable
export class SignalingService {
  private readonly logger = new ConsoleLogger(SignalingService.name);
  private readonly sessions = new Map<string, Session>();

  async joinSession(sessionId: string, socket: Socket): Promise<void> {
    const room = this.sessions.get(sessionId);
    if (!room) {
      this.logger.debug(`[🔌 ${socket.id}]: Creating session: [🔒 ${sessionId}]`);
      socket.join(sessionId);
      this.sessions.set(sessionId, { participants: [socket.id] });
      socket.emit("created");
    } else if (room.participants.length === 1) {
      this.logger.debug(`[🔌 ${socket.id}]: Joining session: [🔒 ${sessionId}]`);
      socket.join(sessionId);
      room.participants.push(socket.id);
      socket.emit("joined");
    } else {
      this.logger.debug(`[🔌 ${socket.id}]: Session full: [🔒 ${sessionId}]`);
      socket.emit("full");
    }
  }

  async ready(sessionId: string, socket: Socket): Promise<void> {
    socket.broadcast.to(sessionId).emit("ready");
  }

  async leaveSession(sessionId: string, socket: Socket): Promise<void> {
    const room = this.sessions.get(sessionId);
    if (room) {
      socket.leave(sessionId);
      const index = room.participants.indexOf(socket.id);
      if (index !== -1) {
        room.participants.splice(index, 1);
      }
      socket.broadcast.to(sessionId).emit("leave");
    }
  }

  async sendOffer(
    { offer, sessionId }: RequestOfferDto,
    socket: Socket
  ): Promise<void> {
    socket.broadcast.to(sessionId).emit("offer", offer);
  }

  async sendAnswer(
    { answer, sessionId }: RequestAnswerDto,
    socket: Socket
  ): Promise<void> {
    socket.broadcast.to(sessionId).emit("answer", answer);
  }

  async sendIceCandidate(
    { candidate, sessionId }: RequestCandidateDto,
    socket: Socket
  ): Promise<void> {
    socket.broadcast.to(sessionId).emit("ice-candidate", candidate);
  }
}
