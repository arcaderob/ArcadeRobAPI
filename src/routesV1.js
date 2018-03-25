const addRoutes = (server) => {

    const respond = (req, res, next) => {
        res.send('Running-' + new Date().getTime());
    };

    server.get('/test', respond);
    server.head('/test', respond);
};

module.exports = {
    addRoutes
};