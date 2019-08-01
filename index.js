const puppeteer = require('puppeteer'),
      devices = require('puppeteer/DeviceDescriptors'),
      iPhone = devices['iPhone X'], 
      fs = require('fs'), 
      path = require('path'),
      jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function processBookListFromWeiXin(url){
    console.log('Browser init...');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulate(iPhone);

    console.log('Browser fetch data...');
    await page.goto(url);
    console.log('Browser process data...');

    const title = await page.$eval('.rich_media_title', tags => tags.innerText);

    const c = await page.$$eval('*', function(tags){
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
    //http://mp.weixin.qq.com/s/A8hVkkxnhIUaizr7TvI83A
    //http://mp.weixin.qq.com/s/4bnhVoG-8nk88jJKbb47iQ
    //http://mp.weixin.qq.com/s/dbZFOwRAnDV2N2ABQwWEtw
    //http://mp.weixin.qq.com/s/4tfma7hrLdppudUFzyUzdA
    //http://mp.weixin.qq.com/s/NJrQAjpKQNmHf01IQ_EX4g
    //http://mp.weixin.qq.com/s/cLV-eBF18nYOhGqH0S1vVg
    //https://mp.weixin.qq.com/s/j63Mi1WPLNWlhyTUCBKxdg
    //https://mp.weixin.qq.com/s/NjCWOp-C8VfLIHmlD66LoA
    //https://mp.weixin.qq.com/s/oIqEOdPp4ZwJS4sCJ8ylFg
    //https://mp.weixin.qq.com/s/_n0lVSWfCI8yQVpMLEjQZA
    //https://mp.weixin.qq.com/s/Hy_QqpyRP2f8pUe6MQc7Ig
    //https://mp.weixin.qq.com/s/QwWgBatmAo6Np9kuHRV1bg
    //https://mp.weixin.qq.com/s/T-41lHUwBhvwu9YZVP1Q7w
    //https://mp.weixin.qq.com/s/jewXt-7EFOg8FOiQ14sozA
    //https://mp.weixin.qq.com/s/7XdRbnibvGHj3EQSNh6_1Q
    //https://mp.weixin.qq.com/s/4qO6jGNa44o5SpASkpvR5g
    //https://mp.weixin.qq.com/s/ZsWKX5WDVXn03ESml5PyIw
    //https://mp.weixin.qq.com/s/euGR5C6oUtrGQP72wmc2Gw
    //https://mp.weixin.qq.com/s/UBLCAsZ7I5VPBV9g2Ytzvg
    //https://mp.weixin.qq.com/s/PVUgIccOkJ-zgstRginlxg
    //https://mp.weixin.qq.com/s/iaTNbZcs36VCtv1eNF3hoA
    //https://mp.weixin.qq.com/s/g3UNpONiBSRzXdS1C1XWgg
    //https://mp.weixin.qq.com/s/uahYxjkffJnxChOdOPpmfQ
    //https://mp.weixin.qq.com/s/ILqq7hjp84sJtwE8dU39fA
    //https://mp.weixin.qq.com/s/uEf5HEAr2R4dQ1hEifS5Bg
    //https://mp.weixin.qq.com/s?__biz=MzI2NDk5NzA0Mw==&mid=2247499097&amp;idx=1&amp;sn=db08e92ca30547bda9b08d6b61b12aef&source=41#wechat_redirect
    //https://mp.weixin.qq.com/s?__biz=MzI2NDk5NzA0Mw==&mid=2247498185&amp;idx=1&amp;sn=df8428cc95e3ee2999bc2d6a90e85a51&source=41#wechat_redirect
    //https://mp.weixin.qq.com/s?__biz=Mzg5MzE2ODM5NQ==&mid=2247484129&amp;idx=1&amp;sn=31d281e3cbd2f97c410fc20e3a55fd11&source=41#wechat_redirect
    //https://mp.weixin.qq.com/s?__biz=MzI5ODAwNjQyOQ==&mid=2456093038&idx=1&sn=06c44200c46464f5aaa64425ece70ba6&chksm=fb3dc39ccc4a4a8a7c8f137ac50688f99bf48b622458a1edeb8f7a6e12f678b6a27ebc3e186b&mpshare=1&scene=1&srcid=0515I63r9hNAfKucjUy0VYuN#rd
    //https://mp.weixin.qq.com/s?__biz=MjM5MDczODM3Mw==&mid=2653028929&idx=1&sn=457530280b6d6d1fcfe1ae69de01392f&chksm=bd9690eb8ae119fddc3c18cc2688d5d8b245168c84466b2af81fa93e95eafb72b6b95b130f81&mpshare=1&scene=1&srcid=#rd
    //https://mp.weixin.qq.com/s?__biz=MzI2NDk5NzA0Mw==&mid=2247541481&idx=1&sn=6440faf94168a49452233e5fdbdd5a77&chksm=eaa67335ddd1fa23b7661d32d21731484d61bdab2e1a56f534eec8fa32b3402f323134593c74&mpshare=1&scene=1&srcid=#rd
    //https://mp.weixin.qq.com/s?__biz=MjM5NTk0NjMwOQ==&mid=2651090890&idx=1&sn=61c1d4a69b80629c13810f18ed2b5c1b&chksm=bd0005e08a778cf6ca045dd16451a25744ee73bbe426a9a6c44c0ae23e93935a357f0dae6796&mpshare=1&scene=1&srcid=#rd
    //https://mp.weixin.qq.com/s?__biz=MzUyMDE1MzU2Mw==&mid=2247493399&idx=1&sn=93f2d50bf9b954d4573af90a8389a0f5&chksm=f9ec17a3ce9b9eb5e6a2f25aa24affe4786a2463816e718e0e8da25dc34fb3a8b3280a15b47f&mpshare=1&scene=1&srcid=0701HPJaLStYfrOZ4BpQ7FIS#rd
    //https://mp.weixin.qq.com/s?__biz=MzU5OTI0NTc3Mg==&mid=2247487300&idx=1&sn=66dd12daf9aa284e5348ada6afc39808&chksm=feb699e7c9c110f16dc59e4855162aea023583e930ebc988e604b0aa37464a15eab54b33e946&mpshare=1&scene=1&srcid=#rd
    //https://mp.weixin.qq.com/s?__biz=MjM5NzUzODI1Mg==&mid=2652567292&idx=1&sn=8c47a0a26a868a23f2e631b6b89447c8&chksm=bd36265f8a41af49eaf5c0f777fa336342212507985fdd9b039c41bd872141fc5657009f6270&mpshare=1&scene=1&srcid=#rd

    const data = await processBookListFromWeiXin('https://mp.weixin.qq.com/s?__biz=MjM5NTk0NjMwOQ==&mid=2651090890&idx=1&sn=61c1d4a69b80629c13810f18ed2b5c1b&chksm=bd0005e08a778cf6ca045dd16451a25744ee73bbe426a9a6c44c0ae23e93935a357f0dae6796&mpshare=1&scene=1&srcid=#rd');

    console.log('process new data count:' + data.length);

    const unduplicationData = await appendDataToBookList(data);

    console.log('process finish data count:' + unduplicationData.length);

    await writeDataToFile(unduplicationData);
})();




