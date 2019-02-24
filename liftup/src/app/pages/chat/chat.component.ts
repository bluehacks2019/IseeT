import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WebsocketserverService } from '../../services/websocketserver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('textAreaMessage') private mytextAreaMessage: ElementRef;


  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  messageSets: any[];
  chatMateInfos: any[];
  chatMateInfo: any;

  fromId = 'f7cc866d-622b-4bf8-a78c-1c9802e41721';
  toId = 'f7cc866d-622b-4bf8-a78c-1c9802e41721';
  message = '';
  ws: WebSocket;
  search = "";
  userSet: any;
  audioSend: any;
  audioReceive: any;
  isFirst = true;


  constructor(private dataService: DataService, private wsService: WebsocketserverService, private router: Router) {

   
    this.fromId = localStorage.getItem('id');
    this.GetUserSet(this.fromId);
    console.log(localStorage.getItem('id'));

    wsService.createObservableSocket("ws://10.13.66.244:9000")
      .subscribe(data => {
        console.log("HEEEEREEE = " + data);
        this.syncAction(data);
      });

      this.audioSend = new Audio();
      this.audioSend.src = "../../assets/sounds/send.mp3";
      this.audioSend.load();
      this.audioReceive = new Audio();
      this.audioReceive.src = "../../assets/sounds/receive.mp3";
      this.audioReceive.load();
  }

  syncAction(data) {
    // let spData = data.split(';');
    if (data.includes(localStorage.getItem('id'))) {
      this.audioReceive.play();
      data = data.replace('Id:' + localStorage.getItem('id') + ';', '');
      this.GetAllChatMatesInfo(localStorage.getItem('id'), this.search);
      if (this.chatMateInfos.length > 0) {
        this.getAllMessageSets(localStorage.getItem('id'), this.chatMateInfo.UserInfo.UserAccountId);
      }
    }
  }

  GetUserSet(UserAccountId) {
    this.dataService.GetUserSet('UserInfos', UserAccountId).subscribe((data: any) => {
      this.userSet = data;
    });
  }

  ngOnInit() {
    this.GetAllChatMatesInfo(localStorage.getItem('id'), this.search);
  }

  getAllMessageSets(fromId, toId) {
    this.dataService.GetAllMessageSet('TextMessages', fromId, toId).subscribe((data: any[]) => {
      this.messageSets = data;
      console.log(this.messageSets);
    });
  }

  GetAllChatMatesInfo(userAccountId, search) {
    this.dataService.GetAllChatMatesInfo('TextMessages', userAccountId, search.trim()).subscribe((data: any[]) => {
      data.forEach(element => {
        element.Selected = false;
      });
      this.chatMateInfos = data;
      if(this.isFirst && this.chatMateInfos.length > 0)
      {
        this.SetCurrentChatMate(this.chatMateInfos[0]);
        this.isFirst = false;
      }
    });
  }

  SetCurrentChatMate(chatMate) {
    this.chatMateInfos.forEach(chat => {
      chat.Selected = false;
    });
    this.chatMateInfos[this.chatMateInfos.indexOf(chatMate)].Selected = true;
    this.chatMateInfo = chatMate;
    this.getAllMessageSets(localStorage.getItem('id'), this.chatMateInfo.UserInfo.UserAccountId);
  }

  SetMessage(event) {
    this.message = event.target.value;
  }

  SetSearch(event) {
    this.GetAllChatMatesInfo(localStorage.getItem('id'), event.target.value.trim());
  }

  addMessageSet() {
    let textMessage = {
      Id: null,
      FromUserAccountId: localStorage.getItem('id'),
      ToUserAccountId: this.chatMateInfo.UserInfo.UserAccountId,
      Message: this.message,
      DateTime: null
    };
    console.log(textMessage);
    this.message = '';
    this.mytextAreaMessage.nativeElement.value = '';
    this.dataService.AddMessageSet('TextMessages', textMessage).subscribe((data: any) => {
      this.getAllMessageSets(localStorage.getItem('id'), this.chatMateInfo.UserInfo.UserAccountId);
      this.wsService.sendData('Id:' + this.chatMateInfo.UserInfo.UserAccountId + ';');

      this.audioSend.play();
    });
  }

  keyUpFunction(event) {
    // if (this.mytextAreaMessage.nativeElement.value.trim() != '') {
    //   this.addMessageSet();
    // }
  }

}
