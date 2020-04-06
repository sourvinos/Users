import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { FieldValidators } from '../register/username-validators';
import { CrossFieldValidators } from '../register/crossfield-validators';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
})

export class ChangePasswordComponent implements OnInit {

    // #region Variables

    id: string
    // user: User
    url = '/users'
    hidePassword = true
    errorList: string[] = [];

    form = this.formBuilder.group({
        id: '',
        currentPassword: ['', [Validators.required, Validators.maxLength(100)]],
        passwords: this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128), FieldValidators.cannotContainSpace]],
            confirmPassword: ['', [Validators.required]],
        }, { validator: CrossFieldValidators.cannotBeDifferent })
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) { }
    ngOnInit() { }

    onSubmit() {
        if (!this.form.valid) { return }
        this.accountService.changePassword(this.form.value.currentPassword, this.form.value.newPassword, this.form.value.confirmNewPassword).subscribe(() => {
            alert('Password changed')
        }, error => {
            this.errorList = []
            error.error.response.forEach((element: string) => {
                this.errorList.push(element + '\n');
                console.log(element)
            })
            alert(this.errorList)
        })
    }

    get currentPassword() {
        return this.form.get('currentPassword')
    }

    get newPassword() {
        return this.form.get('newPassword')
    }

    get confirmNewPassword() {
        return this.form.get('confirmNewPassword')
    }

}
