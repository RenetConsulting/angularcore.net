import { ICoreCaptchaOptions } from '@renet-consulting/core-captcha';
import { Injectable } from "@angular/core";

@Injectable()
export class CoreCaptchaOptions implements ICoreCaptchaOptions {

    readonly height = 80;
    readonly width = 500;
}
