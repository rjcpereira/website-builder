const headers = {
    "Cache-Control": "max-age=15",
    "X-Powered-By": "WebsiteBuilder",
    "Strict-Transport-Security": "max-age=31536000; preload",
    "Content-Security-Policy": "upgrade-insecure-requests; block-all-mixed-content;",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Feature-Policy": "camera 'none'; microphone 'none'",
    "Permissions-Policy": "camera=(), microphone=()",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "DNT, Origin, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Accept, Content-Range, Range, Pragma, Upgrade-Insecure-Requests",
    "Access-Control-Allow-Credentials": true
};

module.exports = (req, res, next) => {
    res.set(headers);
    next();
};