import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { WebsocketserverService } from '../../services/websocketserver.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

  depressionSymptoms: any[];
  depressionTypes: any[];
  currentItemNo = 1;
  currentItem: any;
  resultShowable = false;
  evaluationStarted = false;
  resultString = "";
  councilors: any[];
  audioSend: any;
  audioReceive: any;
  dateResult: any;

  constructor(private dataService: DataService, private router: Router,
  private wsService: WebsocketserverService) {
    wsService.createObservableSocket("ws://10.13.66.244:9000")
    .subscribe(data => {
      this.syncAction(data);
    });
   }

  ngOnInit() {
    this.GetAllDepressionTypeSet();
    this.GetAllDepressionSymptoms();
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

  GetAllDepressionSymptoms() {
    this.dataService.GetAllDepressionSymptoms('DepressionSymptoms').subscribe((data: any) => {
      data.forEach(element => {
        element.Answer = 'No';
      });
      this.depressionSymptoms = data;
      console.log(this.depressionSymptoms);
      this.GetCurrentItem();
    });
  }

  GetAllDepressionTypeSet() {
    this.dataService.GetAllDepressionTypeSet('DepressionTypes').subscribe((data: any) => {
      data.forEach(element => {
        element.DepressionType.SymptomsCount = 0;
      });
      this.depressionTypes = data;
      console.log(this.depressionTypes);
    });
  }

  GetCurrentItem() {
    this.currentItem = this.depressionSymptoms[this.currentItemNo - 1];
  }

  SetAnswer(answer) {
    this.depressionSymptoms[this.currentItemNo - 1].Answer = answer;
    this.depressionTypes.forEach(depresType => {
      if (this.currentItem.DepressionTypeId == depresType.DepressionType.Id && answer == 'Yes') {
        depresType.DepressionType.SymptomsCount++;
      }
    });
    if (this.currentItemNo < this.depressionSymptoms.length) {
      this.currentItemNo++;
      this.GetCurrentItem();
    }
    else {
      this.ShowResult();
    }
  }

  Proceed() {
    this.resultShowable = false;
    this.evaluationStarted = true;
  }

  ShowResult() {
    this.resultString = "According to what you answered, " + '\n' + "you are most likely experiencing the following kinds of depression:";
    console.log(this.depressionTypes);
    let depressionTypesString = "";

    this.depressionTypes.forEach(depresType => {
      if ((depresType.TotalSymptoms < 5 && depresType.DepressionType.SymptomsCount >= depresType.TotalSymptoms)
        || (depresType.TotalSymptoms >= 5 && depresType.DepressionType.SymptomsCount >= 5)) {
        depressionTypesString += '\n' + "- " + depresType.DepressionType.Name;
      }
    });

    if (depressionTypesString == "") {
      this.resultString = "Nice! According to what you answered, " + '\n' + "you are less likely experiencing depression.";
    }
    else {
      this.resultString += '\n' + depressionTypesString;
    }

    this.resultString += '\n' + "Again, we still recommend you to talk to your councilor/psychiatrist" + '\n' + "to confirm and to be informed what to do."

    this.dateResult = new Date();
    this.resultShowable = true;
    this.evaluationStarted = false;
  }


  ChooseCouncilor() {
    this.GetAllCouncilors();
  }

  GetAllCouncilors() {
    this.dataService.GetAllCouncilors('UserInfos').subscribe((data: any[]) => {
      this.councilors = data;
    });
  }

  addMessageSet(toId, name, result) {
    let textMessage = {
      Id: null,
      FromUserAccountId: localStorage.getItem('id'),
      ToUserAccountId: toId,
      Message: "Greetings, Councilor " + name + "," + '\n' + "This is the result of my Self-Evaluation as of " 
      + this.dateResult.toLocaleString() + ": "
      + '\n' + "'" + result + "'.",
      DateTime: null
    };
    this.dataService.AddMessageSet('TextMessages', textMessage).subscribe((data: any) => {
      this.wsService.sendData('Id:' + toId + ';');
      this.audioSend.play();
      // this.router.navigate(["/chat"]);
    });
  }

}
