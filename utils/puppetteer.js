const puppeteer = require('puppeteer')

class PuppeteerScraper {
  static sleep (ms) {new Promise(resolve => setTimeout(resolve, ms))}

  async startBrowser() {
    try {
      const browser = await puppeteer.launch({ headless: true })

      const page = (await browser.pages())[0]

      await page.setRequestInterception(true)
      page.on('request', (request) => {
        if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
          request.abort()
        } else {
          request.continue()
        }
      })
      page.setViewport({ width: 1366, height: 768 })
      return { browser, page }
    } catch (error) {
      console.log({ error })
    }
  }

  async closeBrowser(browser) {
    return browser.close()
  }

  static async gotoPage(url, page) {
    try {
      console.log(`requesting  ===> ${url}`)
      await page.goto(url, {
        waitUntil: 'networkidle2',
      })
      return page
    } catch (error) {
      console.error(`Something went wrong while trying to fetch html for url: ${url}`, error)
      return null
    }
  }

  static async gotoNextPage(page, nextPageSelector) {
    try {
      console.log(`requesting  ===> "nextPage"`)
      await page.click(nextPageSelector, {
        waitUntil: 'networkidle2',
      })
      return page
    } catch (error) {
      console.error(`Something went wrong while trying to load nextPage!`)
      return null
    }
  }

  static async getHtml(page) {
    try {
      const html = await page.evaluate(() => document.body.outerHTML)

      return html
    } catch (error) {
      console.error(`Something went wrong while trying to get html!`)
    }
    return ''
  }
}

module.exports = PuppeteerScraper
