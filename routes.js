const { Router } = require('express')

const router = Router()

const controller = require('./controller')

router.get('/news', controller.queryNews)
router.get('/news-puppeteer', controller.queryNewsWithPuppeteer)


module.exports = router