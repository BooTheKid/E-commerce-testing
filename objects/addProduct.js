//import { expect } from '@playwright/test'
//import { v4 as uuid4 } from 'uuid'; //not sure about uuid4  then ad const emailId = uuidv4() and email = emailId + emaiid

export class addProduct {
  constructor(page) {
    this.page = page;

    this.addButton = this.page
      .locator(
        'button[type="submit"][title="Add to Cart"].action.tocart.primary'
      )
      .first();

    this.firstColor = this.page.locator("div.swatch-option.color").first();
    this.firstSize = this.page.getByLabel("XS").first();
  }

  visit = async () => {
    await this.page.goto("/");
  };

  addToCart = async () => {
    await this.firstSize.waitFor({ state: "visible" });
    await this.firstSize.click();

    await this.firstColor.waitFor({ state: "visible" });
    await this.firstColor.click();

    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  };
  // addProduct = async(index) => {
  //     const addProduct = this.page.locatorawait
  //     await addProduct.nth(index).waitFor();
  //     await addProduct.nth(index).waitFor();
  //     //expect basketcountafer bigger then before = product i+ and every time check basket

  // }
  // getBasketCount = async () =>
  //     {
  //         await this.getBasketCount.waitFor();
  //          const text = await this.basketCounter.innerText ();
  //         return parseInt(text, 10)

  //         and validate product removeEventListener .tiHaveCount (items - 1)
  //         look what mean waitFor
  //     }
}
