import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Global } from '../Global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj = {
    email: '',
    password: ''
  }
  signUpObj = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
  isLogin = true;
  constructor(private route: Router, private http: HttpClient, private userService: UserService) { }

  login(){
    let header = new HttpHeaders({
      'Access-Control-Allow-Origin':"*",
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE'
    });
    this.http.post(Global.LOGIN_URL,this.loginObj, {headers:header}).subscribe((res:any) => {
      if(res.status === "OK"){
        alert(res.message);        
        this.userService.nextUserId(res.result[0].id.toString());
        this.userService.nextUserName(res.result[0].firstName + " " + res.result[0].lastName);
        this.route.navigate(['app-home']);
      } else {
        alert(res.message);
      }
    },err => {
      console.error('Unable to retrive Login details');
    });
  }
  register(){
    this.http.post(Global.SIGNUP_URL,this.signUpObj).subscribe((res:any) => {
      if(res.status === "OK"){
        alert(res.message);
        this.isLogin = true;
      } else {
        alert(res.message);
      }
    },err => {
      console.error('Unable to retrive Signup details');
    });
  }
  goToRegister(){
    this.isLogin = false;
  }
  goToLogin(){
    this.isLogin = true;
  }

}
