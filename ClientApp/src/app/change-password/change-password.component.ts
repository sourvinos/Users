import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrossFieldValidators } from '../register/crossfield-validators';
import { FieldValidators } from '../register/username-validators';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
})

export class ChangePasswordComponent implements OnInit {

    form: FormGroup;

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this.form = this.formBuilder.group({
            currentPassword: ['', [Validators.required]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128), FieldValidators.cannotContainSpace]],
                confirmPassword: ['', [Validators.required]],
            }, { validator: CrossFieldValidators.cannotBeDifferent })
        })
    }

    onSubmit() {
        this.accountService.changePassword(this.form.value.currentPassword, this.form.value.passwords.password, this.form.value.passwords.confirmPassword).subscribe(() => {
            alert('Password changed')
            this.router.navigateByUrl('/');
        }, error => {
            const errorList = []
            error.error.response.forEach((element: string) => {
                errorList.push(element + '\n');
                console.log(element)
            });
            alert(errorList)

        })
    }

    get CurrentPassword() {
        return this.form.get('currentPassword')
    }

    get Passwords() {
        return this.form.get('passwords')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    get ConfirmPassword() {
        return this.form.get('passwords.confirmPassword')
    }


}
