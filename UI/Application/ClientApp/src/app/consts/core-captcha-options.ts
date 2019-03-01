import { ICoreCaptchaOptions } from "@renet-consulting/core-captcha";

/** Azure url https://corecaptcha.azurewebsites.net/api/CaptchaCreate */
export const CORE_CAPTCHA_OPTIONS: ICoreCaptchaOptions = {
    height: 80,
    url: 'https://localhost:44301/api/CaptchaCreate',
    width: 500
};
