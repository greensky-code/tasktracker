import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId = new BehaviorSubject('');
  sharedUserId = this.userId.asObservable();
  
  private userName = new BehaviorSubject('');
  sharedUserName = this.userName.asObservable();

  constructor() { }

  nextUserId(userId: string) {
    this.userId.next(userId)
  }
  nextUserName(userName: string) {
    this.userName.next(userName)
  }
}
