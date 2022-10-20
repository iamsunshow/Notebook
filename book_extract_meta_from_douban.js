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
`人人都是产品经理`,
`发展心理学:儿童与青少年 戴维 谢佛`,
`现代制度经济学 盛洪`,
`薛兆丰的经济学讲义 薛兆丰`,
`博弈与社会 张维迎`,
`消费者行为学 利昂 希夫曼`,
`组织行为学 斯蒂芬 罗宾斯`,
`沟通的艺术:看入人里，看出人外`,
`进化心理学 戴维 巴斯`,
`我们的身体 帕斯卡尔·艾德兰 `,
`程序员修炼之道:通向务实的最高境界`,
`超越css:web设计艺术精髓`,
`富豪的心理 : 财富精英的隐秘知识`,
`科学革命的结构 托马斯·库恩`,
`动物庄园 乔治•奥威尔`,
`我们赖以生存的隐喻 乔治·莱考夫`,
`日常生活中的自我呈现 欧文·戈夫曼`,
`制度、制度变迁与经济绩效 道格拉斯·C·诺斯`,
`文化的解释 克利福德·格尔茨`,
`儿童教育心理学 阿尔弗雷德·阿德勒`,
`有毒的父母 克雷格・巴克`,
`原生家庭 : 如何修补自己的性格缺陷 苏珊·福沃德`,
`亲密关系 罗兰·米勒 `,
`10人以下小团队管理手册 堀之内克彦`,
`软件开发的201个原则 Alan M.Davis`,
`向上突破:不一样的产品经理 苏杰`,
`精益数据分析 阿利斯泰尔·克罗尔`,
`幕后产品:打造突破式产品思维 王诗沐`,
`领域驱动设计 埃文斯`,
`数据分析思维 : 分析方法和业务知识 猴子·数据分析学院`,
`陶哲轩教你学数学  陶哲轩`,
`0-6岁儿童游戏地图 云妈`,
`晚熟的人 莫言`,
`历代经济变革得失 吴晓波`,
`价值:我对投资的思考 张磊`,
`弹性计算:无处不在的算力 阿里云基础产品委员会`,
`养育整体 陈忻`,
`结构性改革:中国经济的问题与对策 黄奇帆`,
`变革为何这样难 罗伯特`,
`人人文化:锐意发展型组织DDO`,
`硅谷增长黑客实战笔记 曲卉`,
`海盗传奇 乔恩·怀特`,
`分析与思考 黄奇帆`,
`策略思维 : 商界、政界及日常生活中的策略竞争`,
`系统化思维导论 Gerald M. Weinberg`,
`掌控力:用创业运作系统实现企业卓越运营`,
`管理的常识 陈春花`,
`硅谷之火:个人计算机的诞生与衰落`,
`跨越鸿沟:颠覆性产品营销圣经 杰弗里·摩尔`,
`客户说:如何真正为客户创造价值`,
`华为访谈录 田涛`,
`客户成功:持续复购和利润陡增的基石`,
`善战者说:孙子兵法与取胜法则十二讲`,
`从偶然到必然 华为研发投资与管理实践:华为研发投资与管理实践`,
`普林斯顿微积分读本`,
`线性代数 利昂`,
`人工智能:一种现代的方法 罗素`,
`人工智能:一种现代的方法 Russell`,
`给孩子的人工智能通识课`,
`智慧的疆界:从图灵机到人工智能`,
`数据挖掘导论`,
`概率导论 Dimitri`,
`Python 3破冰人工智能 从入门到实战`
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
