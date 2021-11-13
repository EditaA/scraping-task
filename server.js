const express = require('express')
const routers = require('./routes')

const app = express()

const PORT = 3001
app.use(express.json())

// routs
app.use('/api', routers)

// start server
app.listen(PORT, console.log(`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`))

