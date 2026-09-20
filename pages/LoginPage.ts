import {Page, Locator} from '@playwright/test'
import{BasePage} from './BasePage'




export class  LoginPage extends BasePage{

readonly usernameField :Locator;
readonly passwordField :Locator;
readonly loginButton:Locator;
readonly rememberMeCheckbox:Locator;
readonly forgotPasswordLink:Locator;
readonly errorMessage: Locator;
readonly passwordEyeIcon: Locator;



constructor(page:Page){
    super(page)


        this.usernameField = page.getByTestId('login-username-input');
        this.passwordField = page.getByTestId('login-password-input');
        this.loginButton = page.getByTestId('login-submit-btn');
        this.rememberMeCheckbox = page.getByLabel('Remember me');
        this.forgotPasswordLink = page.getByText('Forgot password?');
        this.errorMessage = page.getByTestId('login-error-message');
        this.passwordEyeIcon = page.locator('button[aria-label="toggle password visibility"]');


}

async goto():Promise<void>{


    return this.navigate('login')

}


async login(username:string,Password:string):Promise<void>{


    await this.usernameField.fill(username)
    await this.passwordField.fill(Password)
    await this.loginButton.click()
  
}
   

async loginWithRememberMe(username:string,Password:string):Promise<void>{


    await this.usernameField.fill(username)
    await this.passwordField.fill(Password)
    await this.rememberMeCheckbox.check()
    await this.loginButton.click()
     
}

async getErrorText():Promise<string>{

    return await this.getLocatorText(this.errorMessage)
}

async togglePasswordVisibility():Promise<void>{

    return await this.passwordEyeIcon.click()
}

async isErrorVisible():Promise<boolean>{

    return await this.errorMessage.isVisible()
}


}