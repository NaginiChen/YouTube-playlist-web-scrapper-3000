const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

const scrapeProduct = async(url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // await page.setViewport({
    //     width: 200,
    //     height: 800
    // });

    page.on('console', consoleObj => console.log(consoleObj.text()))
    await autoScroll(page)

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

const autoScroll = async(page) => {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            const distance = 1000
            const timer = setInterval(() => {
                const scrollHeight = document.documentElement.scrollHeight
                console.log('scroll height: ', scrollHeight)

                const oldPosition = document.documentElement.scrollTop
                window.scrollBy(0, distance);
                console.log('position: ', document.documentElement.scrollTop)
                console.log(`total height: ${totalHeight} \n`)
                const newPosition = document.documentElement.scrollTop

                totalHeight += distance;

                if(oldPosition !== newPosition && totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 1500);
        });
    })
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

