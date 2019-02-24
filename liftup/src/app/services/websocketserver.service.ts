import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketserverService {

  constructor() { }


  ws: WebSocket;

  createObservableSocket(url: string): Observable<any>{
      this.ws = new WebSocket(url);

      return new Observable(observer => {
          this.ws.onmessage = (event) => observer.next(event.data);
          this.ws.onerror = (event) => observer.error(event);
          this.ws.onclose = (event) => observer.complete();
      });
  }

  sendData (data: any) {
      this.ws.send(data);
  }


private socket;

connect(id: string)
{
  // this.socket = io('http://192.168.8.101:5000',{query: 'id='+id});
}

joinRoom(data)
{
    console.log('HELLO!');
    this.socket.emit('join',data);
}

answer(data)
{
    this.socket.emit('answer',data);
}
newUserJoined()
{
    let observable = new Observable<{user:String, message:String}>(observer=>{
        this.socket.on('new user joined', (data)=>{
            observer.next(data);
        });
        return () => {this.socket.disconnect();}
    });

    return observable;
}

leaveRoom(data){
    this.socket.emit('leave',data);
}

userLeftRoom(){
    let observable = new Observable<{user:String, message:String}>(observer=>{
        this.socket.on('left room', (data)=>{
            observer.next(data);
        });
        return () => {this.socket.disconnect();}
    });

    return observable;
}

sendMessage(data)
{
    this.socket.emit('message',data);
}

newMessageReceived(){
    let observable = new Observable<{user:String, message:String}>(observer=>{
        this.socket.on('new message', (data)=>{
            observer.next(data);
        });
        return () => {this.socket.disconnect();}
    });

    return observable;
}
}
