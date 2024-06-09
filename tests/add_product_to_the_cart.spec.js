
import {test} from '@playwright/test'
import {ProductPage} from './productPage' ;



test('Add product to the cart', async ({ page }) => {
  const homePage = new ProductPage(page);

  await homePage.visit();

  await homePage.addToCard();

  await page.pause();


  // Add more steps as needed TODO
  // await homePage.addToCart();
  // await homePage.verifyProductTitle('Expected Product Title');
});

  
