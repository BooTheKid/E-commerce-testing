const { title } = require("process");

class ProductPage {

    constructor(page) {
        this.page = page
    }

    visit = async () =>  {
        await this.page.goto("/")
    }

    addToCard = async () =>
        {
            const firstProductImage = this.page.locator('img.product-image-photo').first();
            const addButton = this.page.locator('button[type="submit"][title="Add to Cart"].action.tocart.primary').first(); 
            const firstColor = this.page.locator('div.swatch-option.color').first();
            const firstSize = this.page.getByLabel('XS').first();

            await firstSize.waitFor({ state: 'visible' });
            await firstSize.click();

            await firstColor.waitFor({ state: 'visible' });
            await firstColor.click();

            await firstProductImage.hover();

            await addButton.waitFor({ state: 'visible' });
            await addButton.click();
        }

        // checkCart = async => TODO
        //     {

        //     }

}

module.exports = { ProductPage };
