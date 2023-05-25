import { Injectable, OnInit } from '@angular/core';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnInit {
  constructor() {}
  ngOnInit(): void {}

  connect() {
    socket.connect();
  }

  disconnect() {
    socket.disconnect();
  }

  emit(event: string, data: string) {
    socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    socket.on(event, callback);
  }
}
