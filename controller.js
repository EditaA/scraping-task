const scraper = require('./scrapers/axios-scraper')
const puppeteerScraper = require('./scrapers/puppeteer-scraper')

module.exports.queryNews = async (req, res) => {
  try {
    const queryData = req.query
    const symbol = queryData.symbol || ''
    const limit = +queryData.limit || 10

    const newsData = await scraper({symbol, limit})

    res.status(201).json(newsData)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}

module.exports.queryNewsWithPuppeteer = async (req, res) => {
  try {
    const queryData = req.query
    const symbol = queryData.symbol || ''
    const limit = +queryData.limit || 10

    const newsData = await puppeteerScraper({symbol, limit})

    res.status(201).json(newsData)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}