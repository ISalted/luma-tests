import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/helpers/pageManager";

import { MagentoTestUserData } from "../data/signInData"
import { WrongUserData } from "../data/signInData"

test.beforeEach(async ({ page }) => {
const pm = new PageManager(page)

    await pm.onMainPage().visitMainPage()
    await pm.onMainPage().clearCookies()
})

test("LogIn test", async ({ page }) => {
    /*
    Check Sign In
    STR:
    1. Open host URL https://magento.softwaretestingboard.com
    2. Clear coookies
    3. Click “Sign in” button
    4. Log in as a registered user
    5. Check the welcome text
    */

    const pm = new PageManager(page)

    await pm.onMainPage().inHeader.signInButtonClick()
    await pm.onSignInPage().loginFromHeader(MagentoTestUserData, 'Clear Coockie')
    let welcomeMessageFromHeader = await pm.onMainPage().inHeader.getWelcomeMessageFromHeader()

    // const response = await page.waitForResponse(response => response.url().includes('') && response.status() === 200)
    // console.log(response)

    expect(welcomeMessageFromHeader).toContain("Welcome")
})

test("LogIn with wrong data Test", async ({ page }) => {
    /*
    Check Sign In
    STR:
    1. Open host URL https://magento.softwaretestingboard.com
    2. Clear coookies
    3. Click “Sign in” button
    4. Log in as a user with wrong email and pass
    5. Check allert message
    */

    const pm = new PageManager(page)

    await pm.onMainPage().inHeader.signInButtonClick()
    await pm.onSignInPage().loginWithWrongData(WrongUserData)
    let unsuccessfulMessage = await pm.onSignInPage().getUnsuccessfulMessageAfterSignIn()
    expect(unsuccessfulMessage).toContain("The account sign-in was incorrect")
})

test.only("LogIn from checkOut page Test", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onMainPage().addToBasketFromMainPage(0, "M", "Blue", pm.onMainPage().inHeader.getBasketCounter())
    await page.pause()
    await pm.onMainPage().addToBasketFromMainPage(1, "L", "White", pm.onMainPage().inHeader.getBasketCounter())
    await pm.onMainPage().inHeader.proceedToCheckout()
    await pm.onCheckoutPage().loginFromCheckout(MagentoTestUserData)
    const shippingAddressInformation = await pm.onCheckoutPage().getShippingAddressInformation()
    expect(shippingAddressInformation).toContain("Pennsylvania Avenue NW")
})
