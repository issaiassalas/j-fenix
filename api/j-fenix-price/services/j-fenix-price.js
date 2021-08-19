'use strict';
const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

const trimComma = text => text.split(',').join('');

const newPrice = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        
        await page.goto('https://bscscan.com/tokenholdings?a=0x30fec4ac8ed818ec5f094c270eed5436992a9a50');

        await sleep(2000);

        let element = await page.$("#HoldingsUSD");
        const totalHolding = await page.evaluate(element => element.textContent, element);
        console.log(totalHolding)

        element = await page.$("#tb1 > tr:nth-child(3) > td:nth-child(4)");
        const quantity = await page.evaluate(element => element.textContent, element);
        console.log(quantity)

        const a = parseFloat(trimComma(totalHolding.substring(1)));
        const b = parseFloat(trimComma(quantity));
        const total = a / b;
        console.log(total)
        
        await page.goto('https://bscscan.com/token/0xe467c3c666fda4955ffe8159a7bb475f40e112a3');

        await sleep(2000);

        element = await page.$('#ContentPlaceHolder1_tr_tokenHolders > div > div > div > div');
        const totalHolders = await page.evaluate(element => element.textContent, element);
        console.log(totalHolders)

        element = await page.$('#ContentPlaceHolder1_trNoOfTxns > div > div > span');
        const transactionsNum = await page.evaluate(element => element.textContent, element);
        console.log(transactionsNum)

        if (totalHolding && quantity && total && totalHolders && transactionsNum) {
            await strapi.query('j-fenix-price').create({
                price: total,
                total_holding: a,
                quantity: b,
                num_holders: totalHolders.split(' ')[0],
                num_transactions: transactionsNum
            });
        }

    } catch (error) {
        console.log(error)
    } finally {
        await sleep(5000);
        await browser.close();
    }
  
};

module.exports = {
    newPrice
};
