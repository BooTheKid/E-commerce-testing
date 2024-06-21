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

    let success = false;
    let retries = 3;

    while (!success && retries < maxRetries) {
      try {
        await pom.addToCartSecondProduct();
        success = true;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
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
    await pom.addToCart();

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
