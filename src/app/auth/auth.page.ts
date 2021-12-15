import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading: Boolean = false;
  isLogin: Boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging In ....',
      })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe(
          (data) => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/discover');
          },
          (errRes) => {
            loadingEl.dismiss();
            const codeErr = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (codeErr === 'EMAIL_EXISTS') {
              message = 'This email address already exists!.';
            } else if(codeErr === 'EMAIL_NOT_FOUND'){
              message = 'Email address could not be found.'
            } else if(codeErr === 'INVALID_PASSWORD'){
              message = 'This password is not correct.'
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  OnSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication Failed',
        message: message,
        buttons: ['OK'],
      })
      .then((alertEl) => alertEl.present());
  }
}
