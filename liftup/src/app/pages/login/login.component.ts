import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = "";
  password = "";
  userSet: any;
  error = "";
  registerPhoto: any;
  registerUsername: any;
  registerFirstname: any;
  registerMiddlename: any;
  registerLastname: any;
  registerPassword: any;
  registerConfirmPassword: any;
  selectedFile: any;

  constructor(private dataService: DataService, private router: Router, private location: Location) {
    if (localStorage.getItem("id") != null) {
      location.back();
    }
  }

  ngOnInit() {
  }

  login(username, password) {
    if (username.trim() == '' || password.trim() == '') {
      this.error = "Please enter your username and password!"
    }
    else {
      this.GetUserSetLogin(username, password);
    }
  }

  GetUserSetLogin(username, password) {
    this.dataService.GetUserSetLogin('UserInfos', username, password).subscribe((data: any) => {
      this.userSet = data;
      console.log(this.userSet);
      if (this.userSet != null) {
        localStorage.setItem('id', this.userSet.UserAccount.Id);
        this.router.navigate(["/councilors"]);
        this.error = ""
      }
      else {
        this.error = "Incorrect Username or Password!"
        console.log(this.error);
      }
    });
  }

  Register()
  {
    let acc = {
      UserAccount: {
        Id: null,
        Username: this.registerUsername,
        Password: this.registerPassword,
        UserType: 'Client',
        DateTime: new Date(),
      },
      UserInfo: {
        Id: null,
        UserAccountId: null,
        Firstname: this.registerFirstname,
        Middlename: this.registerMiddlename,
        Lastname: this.registerLastname,
        NameExtension: null,
        Quote: null,
        Photo: this.registerPhoto.replace(/data:image\/png;base64,/g, '').replace(/data:image\/jpeg;base64,/g, ''),
      }
    }

    this.dataService.AddAccount('UserAccounts', acc).subscribe((data: any) => {
      this.login(this.registerUsername, this.registerPassword);
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

}
