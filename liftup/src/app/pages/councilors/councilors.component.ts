import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { WebsocketserverService } from '../../services/websocketserver.service';

@Component({
  selector: 'app-councilors',
  templateUrl: './councilors.component.html',
  styleUrls: ['./councilors.component.scss']
})
export class CouncilorsComponent implements OnInit {

  councilors: any[];
  audioSend: any;
  audioReceive: any;
  userSet: any;
  fromId: any;

  constructor(private dataService: DataService, private router: Router, 
    private location: Location, private wsService: WebsocketserverService) {
    this.fromId = localStorage.getItem('id');
    this.GetUserSet(this.fromId);
    // if (this.userSet.UserAccount.UserType == 'Admin' || this.userSet.UserAccount.UserType == 'Councilor') {
    //   location.back();
    // }
    wsService.createObservableSocket("ws://10.13.66.244:9000")
    .subscribe(data => {
      this.syncAction(data);
    });
  }

  ngOnInit() {
    this.GetAllCouncilors();
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
     
    }
  }

  GetUserSet(UserAccountId) {
    this.dataService.GetUserSet('UserInfos', UserAccountId).subscribe((data: any) => {
      this.userSet = data;
    });
  }


  GetAllCouncilors() {
    this.dataService.GetAllCouncilors('UserInfos').subscribe((data: any[]) => {
      this.councilors = data;
    });
  }

  addMessageSet(toId, name) {
    let textMessage = {
      Id: null,
      FromUserAccountId: localStorage.getItem('id'),
      ToUserAccountId: toId,
      Message: "Greetings, Councilor " + name + ". I need your advice.",
      DateTime: null
    };
    this.dataService.AddMessageSet('TextMessages', textMessage).subscribe((data: any) => {
      this.wsService.sendData('Id:' + toId + ';');
      this.audioSend.play();
      this.router.navigate(["/chat"]);
    });
  }

}
