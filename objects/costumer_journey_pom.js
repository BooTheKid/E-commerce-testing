import { orderDetails } from "../data/orderDetails";
import { expect } from "@playwright/test";

export class addProduct {
  constructor(page) {
    this.page = page;
    this.firstName = orderDetails.firstName;
    this.lastName = orderDetails.lastName;
    this.company = orderDetails.city;
    this.street = orderDetails.street;
    this.city = orderDetails.city;
    this.countryShipping = orderDetails.countryShipping;
    this.zip = orderDetails.zip;
    this.phone = orderDetails.phone;

    this.addButton = this.page.locator(
      'button[type="submit"][title="Add to Cart"].action.tocart.primary'
    );

    this.firstColor = this.page.locator("div.swatch-option.color").first();
    this.firstSize = this.page.locator("div.swatch-option.text").first();
    this.image = this.page.locator("img.product-image-photo");
    this.cartProductsCount = this.page.locator("span.counter-number");
    this.promotion = this.page.locator("a.block-promo.home-main").first();
    this.openCart = this.page.locator("a.action.showcart");
    this.deleteProduct = this.page.locator("a.action.delete");
    this.emptyCartNotification = this.page.getByText(
      "You have no items in your"
    );
    this.agreeDelete = this.page.getByRole("button", { name: "OK" });
    this.checkout = this.page.getByRole("button", {
      name: "Proceed to Checkout",
    });

    this.checkOrderDetails = this.page.locator(
      "#opc-sidebar > div.opc-block-shipping-information > div > div.ship-to > div.shipping-information-content"
    );
    this.price = this.page
      .getByRole("row", { name: "Cart Subtotal $" })
      .locator("span");
    this.sale = this.page.locator(
      "#opc-sidebar > div.opc-block-summary > table > tbody > tr.totals.shipping.excl > td > span"
    );
    this.total = this.page
      .getByRole("row", { name: "Order Total $" })
      .locator("span");
  }

  visit = async () => {
    await this.page.goto("/");
  };

  addToCart = async () => {
    await this.firstSize.click();

    await this.firstColor.click();

    await this.firstSize.hover();

    const addFirstProduct = this.addButton.nth(0);
    await addFirstProduct.click();
  };

  addToCartSecondProduct = async () => {
    const imageFive = this.image.nth(5);
    const addSecondProduct = this.addButton.nth(5);

    await imageFive.waitFor("visible");
    await imageFive.hover();
    await addSecondProduct.waitFor();
    await addSecondProduct.click();
  };

  countProductsInCart = async () => {
    await this.cartProductsCount.waitFor("visible");
    const countProd = await this.cartProductsCount.textContent();
    return parseInt(countProd.trim(), 10);
  };

  openPromotion = async () => {
    await this.promotion.click();
  };

  deleteFromCart = async () => {
    await this.openCart.click();
    await this.deleteProduct.waitFor("visible");
    await this.deleteProduct.click();
    await this.agreeDelete.waitFor("visible");
    await this.agreeDelete.click();
  };

  notificationForEmptyCart = async () => {
    await this.emptyCartNotification.waitFor("visible");
  };

  proceedToCheckout = async () => {
    await this.openCart.click();
    await this.checkout.waitFor("visible");
    await this.checkout.click();
  };

  fillOrderDetails = async (orderDetails) => {
    await this.page
      .getByRole("textbox", { name: "Email Address * Email Address*" })
      .fill(orderDetails.email);
    await this.page.getByLabel("First Name").fill(orderDetails.firstName);
    await this.page.getByLabel("Last Name").fill(orderDetails.lastName);
    await this.page.getByLabel("Company").fill(orderDetails.company);
    await this.page
      .getByLabel("Street Address: Line 1")
      .fill(orderDetails.street);
    await this.page.getByLabel("City").fill(orderDetails.city);
    await this.page.getByLabel("Country").selectOption(orderDetails.country);
    await this.page.getByLabel("Zip/Postal Code").fill(orderDetails.zip);
    await this.page.getByLabel("Phone Number").fill(orderDetails.phone);
    await this.page.getByLabel("Fixed").click();
  };

  nextPage = async () => {
    await this.page.getByRole("button", { name: "Next" }).click();
    await this.checkOrderDetails.waitFor("visible");
  };

  checkTotalPrice = async () => {
    const originPrice = await this.price.textContent();
    const productPrice = parseInt(originPrice.replace("$", ""), 10);

    const originSale = await this.sale.textContent();
    const productSale = parseInt(originSale.replace("$", ""), 10);

    const originTotal = await this.total.textContent();
    const productTotal = parseInt(originTotal.replace("$", ""), 10);
    if (productPrice + productSale === productTotal) {
      console.log("Total Price is correct 😊");
    } else {
      throw new Error("Total price is incorrect 😞");
    }
  };

  validateShipingData = async () => {
    await this.checkOrderDetails.waitFor("visible");

    const shippingData = await this.checkOrderDetails.textContent();
    const firstName = await this.firstName;
    const lastName = await this.lastName;
    const street = await this.street;
    const city = await this.city;
    const countryShipping = await this.countryShipping;
    const zip = await this.zip;
    const phone = await this.phone;
    const adress = [city, zip].join(",  ");

    const trimmedData = shippingData ? shippingData.trim() : "";

    const actualAdress = trimmedData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    const expectedAdress = [
      firstName,
      lastName,
      street,
      adress,
      countryShipping,
      phone,
    ];

    await expect(actualAdress).toEqual(expectedAdress);
  };

  finishOrder = async () => {
    await this.page.getByRole("button", { name: "Place Order" }).click();
    await this.page
      .getByText("Thank you for your purchase!")
      .waitFor("visible");
  };
}
