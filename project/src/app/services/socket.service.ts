import { io } from 'socket.io-client';
import { domain } from './shared-values.service';
import { USerData } from '../types/UserData';
import { Observable, of } from 'rxjs';

export class SocketService {
  private readonly _socket = io(domain);

  connect() {
    this._socket.connect();
  }

  connected(): boolean {
    return this._socket.connected;
  }

  disconnect() {
    this._socket.disconnect();
  }

  emit(event: string, data: string | object) {
    this._socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this._socket.on(event, callback);
  }

  
}
