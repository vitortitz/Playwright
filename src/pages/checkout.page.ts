import { type Page, type Locator, expect } from '@playwright/test';


export interface CheckoutInfo {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly completeHeader: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async fillInformation(info: CheckoutInfo): Promise<void> {
        await this.firstNameInput.fill(info.firstName);
        await this.lastNameInput.fill(info.lastName);
        await this.postalCodeInput.fill(info.postalCode);
        await this.continueButton.click();
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }
    async expectOrderComplete(): Promise<void> {
        await expect(this.page).toHaveURL(/checkout-complete\.html/);
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
    }
}