const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  try {
    const htmlPath = 'file:///' + path.join(__dirname, 'infographic.html').replace(/\\/g, '/');
    const pngPath = path.join(__dirname, 'libsignal_infographic.png');
    const pdfPath = path.join(__dirname, 'libsignal_infographic.pdf');

    console.log('正在啟動 Chrome 生成 LibSignal 資訊圖表...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set a high resolution viewport for the poster screenshot
    await page.setViewport({
      width: 1200,
      height: 1420,
      deviceScaleFactor: 2 // Make it double-density for sharp text
    });

    console.log('正在載入 HTML 頁面與渲染樣式...');
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });

    // Wait for MathJax to finish typesetting if present
    console.log('等待 MathJax 公式排版完成...');
    try {
      await page.evaluate(async () => {
        if (window.MathJax && window.MathJax.startup) {
          await window.MathJax.startup.promise;
        }
      });
    } catch (e) {
      console.warn('MathJax 等待時發生非致命錯誤，繼續流程...', e);
    }

    // Give it a short moment to settle web fonts
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('正在截圖並存為 PNG 圖片...');
    await page.screenshot({
      path: pngPath,
      fullPage: true
    });
    console.log(`PNG 圖片輸出成功：${pngPath}`);

    console.log('正在列印為 PDF 向量檔...');
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      width: '1200px',
      height: '1430px',
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });
    console.log(`PDF 向量檔輸出成功：${pdfPath}`);

    await browser.close();
    console.log('資訊圖表生成流程完成！');
  } catch (error) {
    console.error('生成圖表時發生錯誤：', error);
    process.exit(1);
  }
})();
