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
`任正非在“蓝血十杰”表彰会上的讲话`,
`华为思科和解背后的故事`,
`歼击伏击:华为思科之战启示录`,
`华为:40亿学费师从IBM`,
`AnEveryone Culture:`,
`15个技术类公众微信`,
`2013年平和面试深入分析连载`,
`2019中国年轻人性现状报告`,
`3个帮你摆脱养育焦虑的TED演讲`,
`3分钟介绍OKR`,
`Power House`,
`App Savvy`,
`eBoys: The First Inside Account of VentureCapitalists at Work`,
`Golf is not a game of perfect`,
`HRoot全球人力资源服务机构50强榜单与白皮书`,
`HR人力资源实战整体解决方案:精彩案例全复盘`,
`HR员工激励整体解决方案`,
`HR员工激励经典管理案例`,
`HR绩效管理从助理到总监`,
`Intel微处理器结构、编程与接口`,
`Intel系列微处理器结构、编程和借口技术大全--80X86、Pentium和Pentium Pro`,
`iOS组件与框架--iOS SDK 高级特性剖析`,
`JavaScript动态函数式语言精髓`,
`Java核心技术系列:Java虚拟机规范`,
`Java编码指南 编写安全可靠程序的75条建议`,
`Java脚本编程语言、框架与模式`,
`Linux嵌入式设计`,
`MIC高性能计算编程指南`,
`NYLS3-7岁儿童气质测评工具`,
`Pentium Pro与Pentium Ⅱ系统体系`,
`Speed Matters`,
`WCF服务编程-.NET开发者决战SOA的制胜利剑`,
`Web表单设计:创建高可用性的网页表单`,
`x的奇幻之旅:为什么工作和生活中要有数学思维？`,
`埃涅伊德`,
`安腾体系结构:理解64位处理器和EPIC原理`,
`巴伦周刊`,
`病愈密码:六分钟病愈方法`,
`波比和流浪汉:一直改变我生命的猫`,
`步步惊“芯”——软核处理器内部设计分析`,
`布道之道 - Driving Technical Change:Why People on Your Team Don't Act on Good Ideas,and How to Convince Them They Should`,
`超级精炼，实用，完整地准妈妈宝典`,
`成为尼克松:一个被分割了的男人`,
`程序员，你为什么值这么多钱`,
`创意工厂:贝尔实验室与美国创新的伟大年代`,
`从网管员到CTO-网络设备配置与管理实战详解`,
`代数处理中的舍人误差`,
`动手制作一台计算机`,
`儿童入学成熟度水平系列介绍`,
`法拉耶特将军`,
`方军:9张图解明互联网时代的高效读书法`,
`分布式系统--体系结构和实现:高级课程`,
`分年龄段玩具推荐`,
`该死的会议:如何开会更高效`,
`高级计算机程序设计:课堂汇编语言程序实例分析`,
`高性能嵌入式计算`,
`高性能微处理器--技术与结构`,
`高性能微型计算机体系结构——奔腾、酷睿系列处理器原理与应用技术`,
`鸿蒙出世:中国神兽图鉴`,
`宏微观经济学`,
`环球邮报`,
`继电器和开关电路的符号分析`,
`计算机是怎么跑起来的`,
`计算机是怎样跑起来的`,
`计算机体系结构`,
`绩效管理全流程实战方案`,
`基于EDA技术的单周期CPU设计与实现——计算机组成原理实践`,
`剑桥CAP计算机及其操作系统`,
`金克木:谈读书和“格式塔”`,
`经济学与行为科学中的决策模型`,
`经济学原理2册`,
`经与史:华夏世界的历史建构`,
`可持续性材料:如何做到鱼和熊掌兼得`,
`科创板，一瓶AI的卸妆水`,
`可行计算和可证明的复杂性性质`,
`领导力开发:模型、工具和最佳实践`,
`灭绝:让世界永除疾病祸患？`,
`明道OKR内训课`,
`名企核心人才培养管理笔记:为您揭开一流企业人才`,
`片上多处理器体系结构:改善吞吐率和延迟的技术`,
`贫穷档案`,
`平和妈妈手把手教你2014把孩子送进平和`,
`奇妙的昆虫世界`,
`清文宗与恭亲王`,
`穷养儿，富养女，原来是指这样养`,
`求解难题过程中的事物搜索`,
`让孩子聪明健康的500样营养配餐`,
`沙丘魔堡`,
`上承战略下接激励--薪酬管理系统解决方案`,
`深度绩效奖励全案`,
`世界咖啡:创造集体智慧的汇谈方法`,
`世界观`,
`世界名人录`,
`世界是平的`,
`世界图画书阅读与经典`,
`世界秩序`,
`失控-全人类的最终运和结局`,
`事实`,
`十万个为什么`,
`十问:霍金沉思录`,
`时序机的代数结构理论`,
`事业合伙人`,
`湿营销`,
`实战Java高并发程序设计`,
`受伤的文明`,
`数+学=`,
`数据结构、算法与应用-C++语言描述`,
`数据结构-C语言`,
`谁说读书没用？每天阅读12小时，为巴菲特管理100亿美元资产`,
`斯坦福的GraphBase:组合计算用的平台`,
`算法设计与应用`,
`淘气包谢得意`,
`兔子蹦蹦和青蛙跳跳之寻找金萝卜`,
`微机接口技术实验教程`,
`微控制器架构、编程、接口和系统设计`,
`未来探索:将愿景、承诺和行动融入全系统的引到方法`,
`弦论:大卫·福斯特·华莱士论棒球`,
`新吉姆·克劳种族主义`,
`形式化的常识:麦卡锡论文选集`,
`一匹倔脾气的马`,
`一位二胎妈妈的真实剖白`,
`应对中国:揭开新经济超级大国的面纱`,
`硬件/固件接口设计—提高嵌入式系统开发效率的最佳实践`,
`游戏性是什么:如何更好地创作与体验游戏`,
`幼小衔接别焦虑，跟我玩着做好幼小衔接`,
`阅读习惯养成分享`,
`云连接与嵌入式传感系统`,
`怎样在电子数字计算机上准备程序`,
`战争小孩打破沉默`,
`朝日新闻`,
`中国教育报`,
`中欧名师讲坛路`,
`专业儿童心理行为Conners测评表`,
`专业引到技巧实践指导`,
`专业主义`,
`自动计算手册卷2:线性代数`,
`最强讲解:用简单的语言解释复杂的东西`
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
    fs.writeFileSync(path.resolve(__dirname, './book_list.txt'), BOOK_LIST.join('\n'), 'utf-8');
    let NEW_BOOK_LIST = [];
    let RETRY_BOOK_LIST = [];

    let tid = setInterval(async function(){
        if(n == BOOK_LIST.length) {
            fs.writeFileSync(path.resolve(__dirname, './new_book_list.txt'), NEW_BOOK_LIST.join('\n'), 'utf-8');
            fs.writeFileSync(path.resolve(__dirname, './retry_book_list.txt'), RETRY_BOOK_LIST.join('\n'), 'utf-8');
            
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
