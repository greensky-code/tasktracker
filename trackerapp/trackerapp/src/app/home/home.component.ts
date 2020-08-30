import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Global } from '../Global';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { docuSignClick } from 'docusign-esign';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  timeCount = 0;
  seconds = 0; minutes = 0; hours = 0;
  secondTxt = '00';
  minutesTxt = '00';
  hoursTxt = '00';
  flag = true;
  disableFlagStart = false;
  disableFlagPause = true;
  disableFlagAgree = true;
  disableFlagclear = true;
  isAgree = -1;
  taskDetails = null;
  agreeTerms = false;
  userId: any;
  userName: any;
  
  constructor(private route: Router, private http: HttpClient, private userService: UserService) {}

  ngOnInit(){
    this.userService.sharedUserId.subscribe(data => this.userId = data);
    this.userService.sharedUserName.subscribe(data => this.userName = data);
  }

  logout(){
    this.clear();
    this.route.navigate(['app-login']);
  }

  openMenuItem(e) {
    let menuBtn = document.getElementsByClassName('menu');
    for(let i=0; i<menuBtn.length; i++){
      menuBtn[i].classList.remove('active');
    }
    e.target.classList.add('active');
  }
  enableAgreeBtn() {
    this.agreeTerms = !this.agreeTerms;
    if(this.agreeTerms) {
      this.disableFlagAgree = false;
    } else {
      this.disableFlagAgree = true;
    }
  }
  validate() {
    if(this.agreeTerms) {
      this.isAgree = 1;
      this.start();
    }
  }
  decline(){
    this.isAgree = -1;
  }
  start(){
    if(this.taskDetails == null) {
      alert("Please enter a task details to proceed.");
      return false;
    }
    if(this.isAgree === -1){
      docuSignClick.Clickwrap.render({
        environment: 'https://demo.docusign.net',
        accountId: '94b40f4e-036f-42b5-90ef-418bba1286d3',
        clickwrapId: '811366de-b583-48ae-b6c5-1f17fccf6cd2',
        clientUserId: '1000'
      }, '#ds-clickwrap');
      this.isAgree = 0;
    }
    if(this.isAgree == 1){
      let taskObj = {
        userId : parseInt(this.userId),
        taskDetails: '',
        pendingTask: '',
        loginTime: '',
        logoutTime: '',
        loginDate: ''
      }
      taskObj.taskDetails = this.taskDetails;
      let d = new Date();
      let date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
      let timestamp = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      taskObj.loginTime = date.toString() + ' ' + timestamp.toString();
      taskObj.loginDate = date.toString();

      this.http.post<any>(Global.TASK_LOG_URL, taskObj).subscribe((res:any) => {
        if(res.status === "CREATED"){
          alert(res.message);
          this.disableFlagStart = true;
          this.disableFlagPause = false;
          this.disableFlagclear = false
          this.flag = true;
          setInterval(() => {
            if(this.flag){
              this.convertTime(this.timeCount++);
            }
          }, 1000);
        } else {
          alert(res.message);
        }        
      },err => {
        console.error('Unable to save Task details');
      });      
    }
  }
  stop() {
    this.flag = false;
    this.disableFlagStart = true;
    this.disableFlagPause = false;
    let time = this.timeCount;
    this.convertTime(this.timeCount);
    let taskObj = {
      userId : parseInt(this.userId),
      taskDetails: '',
      pendingTask: '',
      loginTime: '',
      logoutTime: '',
      loginDate: ''
    }
    var pendingTask = prompt("Please enter pending task (if any)", "");
    taskObj.pendingTask = pendingTask;
    let d = new Date();
    let date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    let timestamp = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    taskObj.logoutTime = date.toString() + ' ' + timestamp.toString();
    taskObj.loginDate = date.toString();

    this.http.put<any>(Global.TASK_OUT_URL, taskObj).subscribe((res:any) => {
      if(res.status === "OK"){
        alert(res.message);
      } else {
        alert(res.message);
      }       
    },err => {
      console.error('Unable to save Task details');
    });
  }
  pause(){
    this.flag = !this.flag;
    this.disableFlagStart = true;
  }
  clear(){
    this.flag = false;
    this.disableFlagStart = true;
    this.disableFlagPause = false;
    this.timeCount = 0;
    this.convertTime(this.timeCount);
  }
  
  convertTime(timeCount) {
    if(timeCount > 60) {
      this.minutes = Math.floor(timeCount/60);
      this.seconds = timeCount%60;
      if(this.minutes > 60) {
        this.hours = Math.floor(this.minutes/60);
        this.minutes = timeCount%60;
      }
    } else {
      this.seconds = timeCount;
    }
    if(this.seconds < 10) {
      this.secondTxt = '0' + this.seconds.toString();
    } else {
      this.secondTxt = this.seconds.toString();
    }
    if(this.minutes < 10) {
      this.minutesTxt = '0' + this.minutes.toString();
    } else {
      this.minutesTxt = this.minutes.toString();
    }
    if(this.hours < 10) {
      this.hoursTxt = '0' + this.hours.toString();
    } else {
      this.hoursTxt = this.hours.toString();
    }
  }

}
