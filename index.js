const puppeteer = require('puppeteer'),
      devices = require('puppeteer/DeviceDescriptors'),
      iPhone = devices['iPhone 6'], 
      fs = require('fs'), 
      path = require('path');
 
(async () => {
    console.log('Initialization data, Please wait...');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    /*
    let notebook = JSON.parse(fs.readFileSync(path.resolve(__dirname, './index.json'), 'utf-8'));

    for (let category in notebook) {
        if(category == 'Incomprehension'){
            for (let { url, title, tags } of notebook[category]) {
                console.log('<DT><A HREF="' + url + '" ADD_DATE="1528252907" ICON="">' + title + '</A>');
                console.log('');
                console.log('Category:' + category);
                console.log('URL:' + url);
                console.log('Title:' + title);
                console.log('Tags:' + tags);
                console.log('');

                await page.goto(url);
                await page.pdf({
                    path: path.resolve(__dirname, './' + category + '/' + title + '.pdf')
                });
            }
        }
    }
    */
    await page.emulate(iPhone);

    await page.goto('https://m.baidu.com/');

    console.log(await page.content());

    await browser.close();

    console.log('Finish! See you again.');
})();
