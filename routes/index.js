const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const rawText = await page.evaluate(() => {

        const videoList = document.querySelectorAll('[id="video-title"]');
        const list = [];

        for (let i = 0; i < videoList.length; i++) {
            list[i] = {index: i, video: videoList[i].getAttribute("aria-label") };
        }

        return list;
    });


    await browser.close();
    return rawText;
}

router.get('/', function (req, res) {
    res.render('index');
})

router.post('/results', async function (req, res) {
    const info = await scrapeProduct(req.body.url);
    // res.send(info);

    res.render('results', {videos: info} );
})


module.exports = router;

