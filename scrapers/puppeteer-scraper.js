const PuppeteerScraper = require('../utils/puppetteer')
const cheerio = require('cheerio')

const scraperInstance = new PuppeteerScraper()

const parseHtml = (html, currentPageNo) =>  {
  const $ = cheerio.load(html)
  const rows = $('div[class^=searchstyles__ItemRow]').map((i, el) => {
    if (i===0) {
      return
    }
    const title = $('a>h6', el).text()
    const subTitle = $('a>p', el).text()
    const author = $('span>h6', el).text()
    const publishedDate = $('div>h6', el).text()
    const href = $('a:has(img)', el).attr('href')
    const fullUrl = href? `https://www.coindesk.com${href}`:undefined

    return {title,subTitle, author,publishedDate,fullUrl}
  }).get().filter(el => !!el)

  let nextPageButtonSelector = null
  $('button[class*=searchstyles__PageButton]').each((i, el) => {
    if ($(el).text() == currentPageNo + 1) {
      nextPageButtonSelector = `button[class*=searchstyles__PageButton]:nth-of-type(${i})`
    }
  }).get()

  return [rows, nextPageButtonSelector]
}

const recursiveScraping = async ({limit, page, currentPageNo}, data = []) => {
  const html = await PuppeteerScraper.getHtml(page)
  const [pageData, nextPageButtonSelector] = parseHtml(html, currentPageNo)
  
  data = data.concat(pageData)
  currentPageNo++

  // safe switch to prevent infinit loop
  if(!pageData.length || !nextPageButtonSelector) return data

  if (data.length >= limit) {
    return data.slice(0, limit)
  } else {
    const nextPage = await PuppeteerScraper.gotoNextPage(page, nextPageButtonSelector)
    return await recursiveScraping({limit, page: nextPage, currentPageNo}, data)
  }
}

const scraper = async ({symbol, limit}) => {
  const url = `https://www.coindesk.com/search/?s=${symbol}`
  let currentPageNo = 1

  const { browser, page } = await scraperInstance.startBrowser()
  const homePage = await PuppeteerScraper.gotoPage(url, page)

  const data = await recursiveScraping({limit, page: homePage, currentPageNo}, [])

  await scraperInstance.closeBrowser(browser)
  return data
}

module.exports = scraper