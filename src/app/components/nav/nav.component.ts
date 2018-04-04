import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  title = 'FCC NIGHT';
  user: Observable<firebase.User> = this.AfAuth.authState;

  constructor(public AfAuth: AngularFireAuth) { }

  ngOnInit() { }

  login() {
    return this.AfAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return this.AfAuth.auth.signOut();
  }

}
