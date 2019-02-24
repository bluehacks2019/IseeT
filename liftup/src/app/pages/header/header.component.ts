import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userSet: any;
  fromId: any;

  constructor(private router: Router, private dataService: DataService) {

    if (localStorage.getItem("id") == null) {
      router.navigate(["/login"]);
    }
    else {
      this.fromId = localStorage.getItem('id');
      this.GetUserSet(this.fromId);
      // if (this.userSet.UserAccount.UserType == 'Client') {
      //   router.navigate(["/councilors"]);
      // }
      // if (this.userSet.UserAccount.UserType == 'Admin') {
      //   router.navigate(["/manage"]);
      // }
      // if (this.userSet.UserAccount.UserType == 'Councilor') {
      //   router.navigate(["/chat"]);
      // }
    }
  }

  ngOnInit() {
  }

  GetUserSet(UserAccountId) {
    this.dataService.GetUserSet('UserInfos', UserAccountId).subscribe((data: any) => {
      this.userSet = data;
      if (this.userSet.UserAccount.UserType == 'Councilor') {
        this.router.navigate(["/chat"]);
      }
      if (this.userSet.UserAccount.UserType == 'Admin') {
        this.router.navigate(["/manage"]);
      }
    });
  }

  logout() {
    if (window.confirm('Are you sure you want to Logout?')) {
      localStorage.removeItem('id');
      this.router.navigate(["/login"]);
    }
  }

}
