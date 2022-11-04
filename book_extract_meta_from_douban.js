const puppeteer = require(`puppeteer`),
      devices = require(`puppeteer/DeviceDescriptors`),
      fs = require(`fs`), 
      path = require(`path`);

async function extractBookList(extractData){
    //console.log(`INFO:Browser init...`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36");

    await page.emulate(devices[`iPhone X`]);
    await page.setCookie({
        name: '__utmv',
        value: '30149280.26378',
        domain: '.douban.com',
        path: '/',
        expire: '2024-10-24T03:34:54.000Z'
    }, {
        name: '__utmt',
        value: '1',
        domain: '.douban.com',
        path: '/',
        expire: '2022-10-25T03:44:54.000Z'
    }, {
        name: '__utmb',
        value: '30149280.2.10.1666668894',
        domain: '.douban.com',
        path: '/',
        expire: '2022-10-25T04:04:54.000Z'
    }, {
        name: '__utmz',
        value: '30149280.1666270868.2.2.utmcsr=book.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/',
        domain: '.douban.com',
        path: '/',
        expire: '2023-04-25T15:34:54.000Z'
    }, {
        name: '__utma',
        value: '30149280.1435678354.1666265164.1666312497.1666668894.4',
        domain: '.douban.com',
        path: '/',
        expire: '2024-10-24T03:34:54.000Z'
    }, {
        name: 'push_noty_num',
        value: '0',
        domain: '.douban.com',
        path: '/',
        expire: '2022-11-24T03:34:54.000Z'
    }, {
        name: '_pk_ref.100001.2939',
        value: '%5B%22%22%2C%22%22%2C1666668894%2C%22https%3A%2F%2Fbook.douban.com%2F%22%5D',
        domain: 'search.douban.com',
        path: '/',
        expire: '2023-04-25T15:34:54.000Z'
    }, {
        name: '_pk_ses.100001.2939',
        value: '*',
        domain: 'search.douban.com',
        path: '/',
        expire: '2022-10-25T04:04:54.000Z'
    }, {
        name: '_pk_id.100001.2939',
        value: '035f21ddd9acb30b.1666265164.4.1666668894.1666314518.',
        domain: 'search.douban.com',
        path: '/',
        expire: '2024-10-24T03:34:54.000Z'
    }, {
        name: 'ck',
        value: 'iyS3',
        domain: '.douban.com',
        path: '/'
    }, {
        name: '__utmc',
        value: '30149280',
        domain: '.douban.com',
        path: '/'
    }, {
        name: 'dbcl2',
        value: '"263786629:mXxTw0oBoO4"',
        domain: '.douban.com',
        path: '/',
        expire: '2022-11-19T11:29:57.058Z'
    }, {
        name: 'push_doumail_num',
        value: '0',
        domain: '.douban.com',
        path: '/',
        expire: '2022-11-24T03:34:54.000Z'
    }, {
        name: 'bid',
        value: 'kSu1TaBLA7g',
        domain: '.douban.com',
        path: '/',
        expire: '2023-10-20T11:26:03.443Z'
    });

    //console.log(`DEBUG:`, extractData.url)

    await page.goto(extractData.url);

    if(extractData.jsRender){
        await page.waitFor(1000);
    }

    //console.log(`INFO:Browser process data...`);


    let list = [];

    const books = await page.$$(`.sc-bxivhb`);

    for(let i = 0;i < books.length;i++){
        const title  = await books[i].$eval('.title-text', (element) => element.innerText);
        const href  = await books[i].$eval('.title-text', (element) => element.href);
        const pl  = await books[i].$eval('.pl', (element) => element.innerText);
        const meta  = await books[i].$eval('.meta', (element) => element.innerText);
        let rating_nums = -1;
        try{
            rating_nums  = await books[i].$eval('.rating_nums', (element) => element.innerText);
        }catch(e){ }

        list.push({
            title: title,
            href: href,
            pl: pl,
            meta: meta,
            rating_nums: rating_nums
        });
    }

    let result;

    for(let j = 0; j < list.length;j++){
        if(list[j].title == extractData.originTitle) result = list[j];
    }



/*
    books.forEach(function(book){
        console.log('####', book)
    });
*/


    //console.log(`INFO:Browser process finish.`);

    await browser.close();

    //console.log(`INFO:Browser closed.`);

    return result;
}

// 数据见README
const REPEATED_BOOK_LIST = [
`计算机程序设计艺术・卷1 : 基本算法（第3版）`,
`科学革命的结构`,
`营销管理（第16版）`,
`营销管理（第18888版）`
];

(async () => {
    /*
    http://c.diaox2.com/view/app/?m=show&id=1218&ch=firstpage&from=timeline&isappinstalled=1
    https://m.igetget.com/share/course/article/article_id/86035?from=timeline
    https://www.digitaling.com/articles/168020.html?from=timeline&isappinstalled=0
    https://www.jianshu.com/p/a56b7dd85489
    */
    //

    let n = 0;

    const UNREPEATED_BOOK_LIST =  Array.from(new Set(REPEATED_BOOK_LIST));

    let NEW_BOOK_LIST = [];
    let RETRY_BOOK_LIST = [];

    fs.writeFileSync(path.resolve(__dirname, './book/book_list.txt'), UNREPEATED_BOOK_LIST.join('\n'), 'utf-8');

    let tid = setInterval(async function(){
        if(n == UNREPEATED_BOOK_LIST.length) {
            fs.writeFileSync(path.resolve(__dirname, './book/new_book_list.txt'), NEW_BOOK_LIST.join('\n'), 'utf-8');
            fs.writeFileSync(path.resolve(__dirname, './book/retry_book_list.txt'), RETRY_BOOK_LIST.join('\n'), 'utf-8');
            
            //for(let i = 0;i < 10;i++) console.log(NEW_BOOK_LIST[i])

            clearInterval(tid);
            return;
        }

        const title = UNREPEATED_BOOK_LIST[n];

        console.log(`DEBUG:`, ((n + 1) / (UNREPEATED_BOOK_LIST.length) * 100).toFixed(2) + '%', n, UNREPEATED_BOOK_LIST.length, title);

        const data = await extractBookList({
            url: `https://search.douban.com/book/subject_search?search_text=${encodeURIComponent(title)}&cat=1001`,
            originTitle: title,
            jsRender: true
        });

        if(data)
            NEW_BOOK_LIST.push(`${data.title}#${data.href}#${data.rating_nums}#${data.pl}`);
        else
            RETRY_BOOK_LIST.push(title);

        n++;

    }, 10000);

})();
