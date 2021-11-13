const { Router } = require('express')

const router = Router()

const controller = require('./controller')

router.get('/news', controller.queryNews)


module.exports = router