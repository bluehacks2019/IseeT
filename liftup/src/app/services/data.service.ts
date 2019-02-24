import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  api_url = 'http://10.13.67.12:51210/';
  constructor(private httpClient: HttpClient) { }

  GetAllMessageSet(url: string, FromUserAccountId: any, ToUserAccountId: any) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllMessageSet/?FromUserAccountId=` + FromUserAccountId
    + '&ToUserAccountId=' + ToUserAccountId);
  } 

  AddMessageSet(url: string, object: any) {
    return this.httpClient.post(`${this.api_url}/${url}/AddMessageSet/`, object);
  } 

  GetAllChatMatesInfo(url: string, UserAccountId: any, search: any) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllChatMatesInfo/?UserAccountId=` + UserAccountId + '&search=' + search);
  } 

  GetUserSetLogin(url: string, username: any, password: any) {
    return this.httpClient.get(`${this.api_url}/${url}/GetUserSetLogin/?username=` + username + '&password=' + password);
  }

  AddAccount(url: string, object: any) {
    return this.httpClient.post(`${this.api_url}/${url}/AddAccount/`, object);
  } 


  GetUserSet(url: string, UserAccountId: any) {
    return this.httpClient.get(`${this.api_url}/${url}/GetUserSet/?UserAccountId=` + UserAccountId);
  }

  GetAllCouncilors(url: string) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllCouncilors/`);
  }

  GetAllCouncilorsUserSet(url: string) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllCouncilorsUserSet/`);
  }

  GetAllDepressionSymptoms(url: string) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllDepressionSymptoms/`);
  }

  GetAllDepressionTypeSet(url: string) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllDepressionTypeSet/`);
  }

  GetAllDepressionTypes(url: string) {
    return this.httpClient.get(`${this.api_url}/${url}/GetAllDepressionTypes/`);
  }

  Remove(url: string, id: any) {
    return this.httpClient.delete(`${this.api_url}/${url}/Remove/?id=` + id);
  }

}
