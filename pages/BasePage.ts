import {Page,Locator} from '@playwright/test'



export abstract class BasePage{

    protected readonly page:Page;

    readonly logoutButton: Locator;
    readonly notificationBadge: Locator;
    readonly sidebarDashboard: Locator;
    readonly sidebarTransfer: Locator;
    readonly sidebarTransactions: Locator;

    constructor(page: Page){
        this.page=page

        this.logoutButton = page.getByText('Logout');
        this.notificationBadge = page.locator('[data-testid="notification-badge"]');
        this.sidebarDashboard = page.getByTestId('sidebar-link-dashboard');
        this.sidebarTransfer = page.getByTestId('sidebar-link-transfer');
        this.sidebarTransactions = page.getByTestId('sidebar-link-transactions');

    }


    async navigate(path: string):Promise<void>{

       await this.page.goto(path)

    }


    async getTitle():Promise<string>{

        return await this.page.title();
    }

    async waitForPageLoad():Promise<void>{

        return await this.page.waitForLoadState('load')
    }


    getCurrentUrl(){
        return this.page.url()
    }


    async waitForUrl(urlPattern:'string'|RegExp):Promise<void>{

        return await this.page.waitForURL(urlPattern)
    }



    async getLocatorText(locator:Locator):Promise<string>{

        return await locator.textContent() ?? ''

    }



 async logout(): Promise<void> {
        await this.logoutButton.click();
    }

    async goToDashboard(): Promise<void> {
        await this.sidebarDashboard.click();
    }

    async goToTransfer(): Promise<void> {
        await this.sidebarTransfer.click();
    }

    async goToTransactions(): Promise<void> {
        await this.sidebarTransactions.click();
    }








}