const puppeteer = require('puppeteer'),
      devices = require('puppeteer/DeviceDescriptors'),
      iPhone = devices['iPhone X'], 
      fs = require('fs'), 
      path = require('path'),
      jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function extractBookList(extractData){
    console.log('Browser init...');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulate(iPhone);

    console.log('Browser fetch data...');

    await page.goto(extractData.url);

    if(extractData.jsRender){
        await page.waitFor(1000);
    }

    console.log('Browser process data...');


    const score = await page.$$eval(extractData.selector, function(tags){
        const href = tags.length > 0 ? tags[0]['href'] : '';
        const innerText = tags.length > 0 ? tags[0]['innerText'] : '';

        return href || innerText || '';
    });

    console.log('##########new book score beigin##########')
    console.log(score);
    console.log('##########new book score beigin##########')

    console.log('Browser process finish.');


    await browser.close();

    console.log('Browser closed.');

    return score;
}

(async () => {
    /*
    http://c.diaox2.com/view/app/?m=show&id=1218&ch=firstpage&from=timeline&isappinstalled=1
    https://m.igetget.com/share/course/article/article_id/86035?from=timeline
    https://www.digitaling.com/articles/168020.html?from=timeline&isappinstalled=0
    https://www.jianshu.com/p/a56b7dd85489
    */
    //

    const list = ['白夜行','暗时间','一分钟经理人'];
    let n = 0;

    let tid = setInterval(async function(){
        if(n == list.length) {
            clearInterval(tid);
            return;
        }

        const data = await extractBookList({
            url: 'https://www.douban.com/search?cat=1001&q=' + encodeURIComponent(list[n++]),
            selector: '.nbg',
            //scoreSelector: '.score-num',
            jsRender: true
        });

        console.log('data is :' + data);

        const data1 = await extractBookList({
            url: data,
            selector: '.score-num',
            jsRender: true
        });

        console.log('data1 is :' + data1);

    }, 4000)
})();




