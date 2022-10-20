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
        value: '30149280.4981',
        domain: '.douban.com',
        path: '/',
        expire: '2022-10-19T10:49:00.000Z'
    }, {
        name: '__utmt',
        value: '1',
        domain: '.douban.com',
        path: '/',
        expire: '2022-10-19T10:49:00.000Z'
    }, {
        name: '__utmb',
        value: '30149280.2.10.1666175941',
        domain: '.douban.com',
        path: '/',
        expire: '2022-10-19T11:09:00.000Z'
    }, {
        name: '__utmz',
        value: '30149280.1666175941.1.1.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/',
        domain: '.douban.com',
        path: '/',
        expire: '2023-04-19T22:39:00.000Z'
    }, {
        name: '__utma',
        value: '30149280.1784161962.1666175941.1666175941.1666175941.1',
        domain: '.douban.com',
        path: '/',
        expire: '2024-10-18T10:39:00.000Z'
    }, {
        name: 'push_noty_num',
        value: '0',
        domain: '.douban.com',
        path: '/',
        expire: '2022-11-18T10:39:00.000Z'
    }, {
        name: '_pk_ref.100001.2939',
        value: '%5B%22%22%2C%22%22%2C1666175941%2C%22https%3A%2F%2Faccounts.douban.com%2F%22%5D',
        domain: 'search.douban.com',
        path: '/',
        expire: '2023-04-19T22:39:00.000Z'
    }, {
        name: '_pk_ses.100001.2939',
        value: '*',
        domain: 'search.douban.com',
        path: '/',
        expire: '2022-10-19T11:09:00.000Z'
    }, {
        name: '_pk_id.100001.2939',
        value: '31aba00f3a9ca5f2.1666175941.1.1666175941.1666175941.',
        domain: 'search.douban.com',
        path: '/',
        expire: '2024-10-18T10:39:00.000Z'
    }, {
        name: 'ck',
        value: 'pcYr',
        domain: '.douban.com',
        path: '/'
    }, {
        name: '__utmc',
        value: '30149280',
        domain: '.douban.com',
        path: '/'
    }, {
        name: 'dbcl2',
        value: '"49812717:/eudpt24VPA"',
        domain: '.douban.com',
        path: '/',
        expire: '2022-11-18T10:38:59.504Z'
    }, {
        name: 'push_doumail_num',
        value: '0',
        domain: '.douban.com',
        path: '/',
        expire: '2022-11-18T10:39:00.000Z'
    }, {
        name: 'bid',
        value: 'F8Ftg2DXzC4',
        domain: '.douban.com',
        path: '/',
        expire: '2023-10-19T10:37:55.081Z'
    });

    //console.log(`DEBUG:`, extractData.url)

    await page.goto(extractData.url);

    if(extractData.jsRender){
        await page.waitFor(1000);
    }

    //console.log(`INFO:Browser process data...`);


    const title = await page.$$eval(`.title-text`, function(tags){
        return tags.length > 0 ? tags[0][`innerText`] : ``;
    });

    const href = await page.$$eval(`.title-text`, function(tags){
        return tags.length > 0 ? tags[0][`href`] : ``;
    });

    const score = await page.$$eval(`.rating_nums`, function(tags){
        return tags.length > 0 ? tags[0][`innerText`] : ``;
    });

    const author = await page.$$eval(`.meta`, function(tags){
        return tags.length > 0 ? tags[0][`innerText`] : ``;
    });

    const originTitle = extractData.originTitle;

    const match = title == originTitle ? 1 : 0;

    const high = parseInt(score) >= 9 ? 1 : 0;

    //console.log(`INFO:Browser process finish.`);

    await browser.close();

    //console.log(`INFO:Browser closed.`);

    if(!title || !href || !score || !author) 
        return null;
    else
        return `${title}#${originTitle}#${high}#${match}#${score}#${author}#${href}`;
}

// 数据见README
const REPEATED_BOOK_LIST = [
`一九八四`,
`知行-技术人的管理之路`,
`贫穷的本质`,
`杀死一只知更鸟`,
`一万小时天才理论`,
`习惯的力量:为什么我们会这样生活，那样工作`,
`道德经注释`,
`费曼学习法`,
`穷爸爸富爸爸`,
`刺猬的优雅`,
`飘(乱世佳人)`,
`傲慢与偏见`,
`简爱`,
`大败局`,
`认知觉醒`,
`穷查理宝典`,
`影响商业的50本书`,
`历代经济变革得失`,
`博弈论`,
`经济学的思维方式`,
`灰犀牛:如何应对大概率危机`,
`就业、利息与货币通论`,
`基业长青`,
`奇点临近`,
`创新者的窘境`,
`产品经理手册`,
`产品思维:从新手到资深产品人`,
`从点子到产品:产品经理的价值观与方法论`,
`进化心理学`,
`沟通的艺术:看入人里，看出人外`,
`消费者行为学`,
`博弈与社会`,
`新制度经济学:一个交易费用分析范式`,
`错误的行为:行为经济学的形成`,
`超越智商:为什么聪明人也会做蠢事`,
`认知心理学及其启示`,
`经济学原理`,
`人的行为`,
`社会心理学:阿伦森眼中的社会性动物`,
`帮你的孩子爱上阅读`,
`爱上阅读的秘密`,
`儿童心理学`,
`平和式教养法`,
`向上管理:与你的领导相互成就`,
`变量:推演中国经济基本盘`,
`断舍离`,
`领导梯队:全面打造领导力驱动型公司`,
`组织行为学`,
`沙丘六部曲`,
`价值:我对投资的思考`,
`长尾理论`,
`褚时健传`,
`NLP思维:高效人士都在用的影响力沟通技能`
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

    const BOOK_LIST =  Array.from(new Set(REPEATED_BOOK_LIST));
    fs.writeFileSync(path.resolve(__dirname, './book/book_list.txt'), BOOK_LIST.join('\n'), 'utf-8');
    let NEW_BOOK_LIST = [];
    let RETRY_BOOK_LIST = [];

    let tid = setInterval(async function(){
        if(n == BOOK_LIST.length) {
            fs.writeFileSync(path.resolve(__dirname, './book/new_book_list.txt'), NEW_BOOK_LIST.join('\n'), 'utf-8');
            fs.writeFileSync(path.resolve(__dirname, './book/retry_book_list.txt'), RETRY_BOOK_LIST.join('\n'), 'utf-8');
            
            //for(let i = 0;i < 10;i++) console.log(NEW_BOOK_LIST[i])

            clearInterval(tid);
            return;
        }

        const title = BOOK_LIST[n++];

        const data = await extractBookList({
            url: `https://search.douban.com/book/subject_search?search_text=${encodeURIComponent(title)}&cat=1001`,
            originTitle: title,
            jsRender: true
        });

        console.log(`DEBUG:`, (n / (BOOK_LIST.length - 1) * 100).toFixed(2) + '%', title);

        if(data)
            NEW_BOOK_LIST.push(data);
        else
            RETRY_BOOK_LIST.push(title);

    }, 4000);

})();
