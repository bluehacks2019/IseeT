import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})

export class ManageComponent implements OnInit {

  constructor(private dataService: DataService) { }

  councilors: any[];
  registerPhoto: any;
  registerUsername: any;
  registerFirstname: any;
  registerMiddlename: any;
  registerLastname: any;
  registerPassword: any;
  registerConfirmPassword: any;
  registerQuote: any;
  selectedFile: any;

  ngOnInit() {
    this.GetAllCouncilorsUserSet();
  }

  GetAllCouncilorsUserSet() {
    this.dataService.GetAllCouncilorsUserSet('UserInfos').subscribe((data: any[]) => {
      this.councilors = data;
      console.log(this.councilors);
    });
  }

  RemoveCouncilor(councilor) {
    if (window.confirm('Are you sure you want to remove Councilor '
      + councilor.UserInfo.Firstname + " " + councilor.UserInfo.Lastname + '?')) {
      this.dataService.Remove('UserAccounts', councilor.UserAccount.Id).subscribe((data: any) => {
        this.GetAllCouncilorsUserSet();
      });
    }
  }

  Register() {
    let acc = {
      UserAccount: {
        Id: null,
        Username: this.registerUsername,
        Password: this.registerPassword,
        UserType: 'Councilor',
        DateTime: new Date(),
      },
      UserInfo: {
        Id: null,
        UserAccountId: null,
        Firstname: this.registerFirstname,
        Middlename: this.registerMiddlename,
        Lastname: this.registerLastname,
        NameExtension: null,
        Quote: this.registerQuote,
        Photo: this.registerPhoto.replace(/data:image\/png;base64,/g, '').replace(/data:image\/jpeg;base64,/g, ''),
      }
    }

    this.dataService.AddAccount('UserAccounts', acc).subscribe((data: any) => {
      this.GetAllCouncilorsUserSet();
      this.clear();
    });
  }

  onFileUpload(event) {
    this.selectedFile = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      this.registerPhoto = reader.result.toString();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  clear()
  {
    this.registerPhoto = null;
    this.registerUsername = null;
    this.registerFirstname = null;
    this.registerMiddlename = null;
    this.registerLastname = null;
    this.registerPassword = null;
    this.registerConfirmPassword = null;
    this.registerQuote = null;
    this.selectedFile = null;
  }
}
