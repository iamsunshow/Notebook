const puppeteer = require('puppeteer'),
      devices = require('puppeteer/DeviceDescriptors'),
      iPhone = devices['iPhone X'], 
      fs = require('fs'), 
      path = require('path');

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

    const title = await page.$eval(extractData.titleSelector, tags => tags.innerText);

    console.log('##########new book title beigin##########')
    console.log(title);
    console.log('##########new book title beigin##########')

    const c = await page.$$eval(extractData.contentSelector, function(tags){
        const tagNames = [];

        tags.forEach(function(tag){
            const content = tag.innerText;
            const reg = /《[^》]+》/g; 
            let result;

            while(result = reg.exec(content)){
                var r = result[0].trim();
                if(!tagNames.includes(r)){
                    tagNames.push(r);
                }
            }
        });
        
        return [...new Set(tagNames)];
    });

    let result = [];

    console.log('##########new book list beigin##########')
    c.forEach(function(i){

        i = i.replace('《','');
        i = i.replace('》','');

        result.push({
            name: i.trim(),
            tags: [],
            recommend: [title.trim()]
        })

        console.log(i.trim());
    
    });
    console.log('##########new book list end##########')

    console.log('Browser process finish.');


    await browser.close();

    console.log('Browser closed.');

    return result;
}

function removeDuplication(data){
    console.log('process all data count:' + data.length);

    let ref = {},
        exists = [];

    let result = data.reduce(function(collect, curr, index){
        if(!ref[curr.name]){
            collect.push(curr);
            ref[curr.name] = true;
        }else{
            exists.push(curr);
        }
        return collect;
    }, []);


    console.log('process exist data count:' + exists.length);

    result.forEach(function(element){
        var res = exists.filter(ele => ele.name == element.name);
        if(res && res.length > 0){
            res.forEach(r => element.recommend = element.recommend.length > 0 ? element.recommend.concat(r.recommend) : r.recommend);
        }
    });

    console.log('process duplication data count:' + result.length);

    return result;
}

async function appendDataToBookList(data){
    let oldData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './BookList/data.json'), 'utf-8'));

    console.log('process old data count:' + oldData.length);

    return removeDuplication(oldData.concat(data));
}

async function cleanData(data){
    data.forEach(function(element){
        /*
        var name = element.name;
        if(name.indexOf('</') >= 0){
            const dom = new JSDOM(name);
            element.name = dom.window.document.querySelector("span").textContent; 
            console.log(element.name)
        }
        */
        element.recommend = Array.from(new Set(element.recommend));
    });

    return data;
}

async function writeDataToFile(data){
    var result = await cleanData(data);

    fs.writeFileSync(path.resolve(__dirname, './BookList/data.json'), JSON.stringify(result), 'utf-8');
}

(async () => {
    /*
    http://c.diaox2.com/view/app/?m=show&id=1218&ch=firstpage&from=timeline&isappinstalled=1
    https://m.igetget.com/share/course/article/article_id/86035?from=timeline
    https://www.digitaling.com/articles/168020.html?from=timeline&isappinstalled=0
    https://www.jianshu.com/p/a56b7dd85489
    */
    const data = await extractBookList({
        url: 'https://www.infoq.cn/article/ur1QLockeQ*hXobPm0kI?utm_source=tuicool&utm_medium=referral',
        titleSelector: 'h1',
        contentSelector: '*',
        jsRender: false
    });

    console.log('process new data count:' + data.length);

    const unduplicationData = await appendDataToBookList(data);

    console.log('process finish data count:' + unduplicationData.length);

    await writeDataToFile(unduplicationData);
})();




