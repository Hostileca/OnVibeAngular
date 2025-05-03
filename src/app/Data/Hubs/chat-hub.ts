import {AuthService} from '../Services/auth.service';
import {IHttpConnectionOptions} from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import {ApiConfig} from '../Constants/api';
import {Events} from './events';
import {Message} from '../Models/Message/message';
import {EventBusService} from '../Services/event-bus.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatHub {
  private _hubConnection!: signalR.HubConnection;

  constructor(private readonly _authService: AuthService,
              private readonly _eventBusService: EventBusService) {
    this.connect()
  }

  private connect() {
    if(!this._authService.isAuth){
      return
    }

    const accessToken = this._authService.tokens?.accessToken.value;
    const options: IHttpConnectionOptions = {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => `${accessToken}`
    };

    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`/hubs/chats`, options)
      .build()

    this.startConnection();
  }

  private startConnection() {
    this._hubConnection
      .start()
      .then(() => {
        this.StartEmit()
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  private StartEmit(){
    this._hubConnection.on(Events.MessageSent, (message: Message) => {
      this._eventBusService.Emit(Events.MessageSent, message)
    })
  }
}
