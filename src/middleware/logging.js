
export default (req, res, next) => {
    
    // Log every request method & path
    console.info(req.method, req.url)
    
    next()
    
}
