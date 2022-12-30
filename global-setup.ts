import { chromium, FullConfig } from '@playwright/test';


async function globalSetup(config: FullConfig) {

    // Delay
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    
    // Some variables from .env file
    const { BASE_URL_CP, USERNAME, PASSWORD } = process.env;

    //Login
    const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await page.goto(BASE_URL_CP);
    await page.fill("input#login-username", USERNAME);
    await page.fill(`input#login-password`, PASSWORD);
    await page.click(`button#login-submit`);
 
    // Save storage state into the file.
    await delay(4000);
    await page.context().storageState({ path: 'state.json' });
    await browser.close();

    // defining some variables
    process.env.slug = 'text=Convious Marketing | Demo Check-Out'
    process.env.discount_page = '/account/convious_demo/venue/codes/discount/pools'
    process.env.codes_tab = '/account/convious_demo/venue/codes/discount/codes'

    // random string generation function
    const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    
    // input variables
    process.env.discount_pool = `AAA+test+${randomString}`
    process.env.discount_code = `CODE${randomString}`
    process.env.input_file = "input[type='file']"
    process.env.valid_file = 'test-files/discount_valid.csv'
    process.env.invalid_file = 'test-files/discount_invalid.csv'
}
export default globalSetup;