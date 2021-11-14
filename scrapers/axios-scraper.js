const axios = require('axios')

const scraper = async (query) => {
    try {
    const res = await axios.get(`https://api.queryly.com/json.aspx?queryly_key=d0ab87fd70264c0a&query=${query.symbol}&endindex=0&batchsize=${query.limit}&extendeddatafields=creator,creator_slug,subheadlines,primary_section,report_url,section_path,sections_paths,subtype,type,imageresizer,section,sponsored_label,sponsored,promo_image,pubDate&sort=date`)
    
    return res.data.items
    } catch (error) {
        console.error(error)
    }
}


module.exports = scraper