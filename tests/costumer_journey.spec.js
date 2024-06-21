import { test, expect, waitForTimeout } from "@playwright/test";
import { addProduct } from "../objects/costumer_journey_pom";
import { orderDetails } from "../data/orderDetails";

test.describe("E2E tests", () => {
  test.beforeEach(async ({ page }) => {
    const pom = new addProduct(page);
    await pom.visit();
  });

  test("Add a product to cart", async ({ page }) => {
    const pom = new addProduct(page);
    await pom.addToCart();

    const oneProduct = await pom.countProductsInCart();

    let secondProductIsAdded = false;
    let i = 0;

    while (!secondProductIsAdded && i < 3) {
      try {
        await pom.addToCartSecondProduct();
        secondProductIsAdded = true;
      } catch (error) {
        i++;
        if (i >= 3) {
          throw error;
        }
      }
    }

    // await pom.addToCartSecondProduct();

    const secondProduct = await pom.countProductsInCart();
    if (oneProduct < secondProduct) {
      console.log(
        `✅ Product was succesfuly added to Cart. Count of added products: ${secondProduct}`
      );
    } else {
      console.log(`❌ Count of products on Cart not suit: ${secondProduct}`);
    }
  });

  test("Add a product from promotion section", async ({ page }) => {
    const pom = new addProduct(page);

    await pom.openPromotion();

    let productIsAdded = false;
    let i = 0;

    while (!productIsAdded && i < 3) {
      try {
        await pom.addToCart();
        productIsAdded = true;
      } catch (error) {
        i++;
        if (i >= 3) {
          throw error;
        }
      }
    }

    const promotionProduct = await pom.countProductsInCart();

    await expect(promotionProduct).toBeGreaterThan(0);
  });

  test("Delete a product from cart", async ({ page }) => {
    const pom = new addProduct(page);
    await pom.addToCart();
    const addedProduct = await pom.countProductsInCart();
    await expect(addedProduct).toBeGreaterThan(0);

    await pom.deleteFromCart();
    await pom.notificationForEmptyCart();
  });

  test("Finish Order", async ({ page }) => {
    const pom = new addProduct(page);
    await pom.addToCart();
    await page.waitForTimeout(3000);
    await pom.proceedToCheckout();
    await pom.fillOrderDetails(orderDetails);
    await pom.nextPage();
    await pom.validateShipingData();
    await pom.checkTotalPrice();
    await pom.finishOrder();
  });
});
