import { test } from "@playwright/test";
import { addProduct } from "../objects/addProduct";
import { deleteFromCart } from "../objects/deleteFromCart";
import { finishOrderw } from "../objects/finishOrder";

test("Add product to the cart", async ({ page }) => {
  const homePage = new addProduct(page);

  await homePage.visit();

  await homePage.addToCart();

  // check that counter number is more than before
  // delete from cart
  // (check that counter number is less than beffor)
  //add again product
  //go to cart and fill alll data to order - use uuid for create email
  // save somewere
});
