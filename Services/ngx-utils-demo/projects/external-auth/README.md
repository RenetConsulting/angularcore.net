# @renet-consulting/external-auth

This library provides implicit flow, to sign in with Google and Facebook, this lib ueses nex client CDK:
https://developers.facebook.com/docs/facebook-login/web
https://developers.google.com/identity/sign-in/web/sign-in

## Example of use
```
import { FacebookSigninModule, GoogleSigninModule } from '@renet-consulting/external-auth';

@NgModule({
    ...
    imports: [

        FacebookSigninModule,
        GoogleSigninModule,
    ],
    ...
})
export class SigninModule { }
```
## Breaking changes in version 9.x
- ExternalAuthBase renamed to ExternalAuthBaseDirective