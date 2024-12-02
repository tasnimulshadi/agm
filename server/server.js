const auth = require("json-server-auth");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 9000;

// Bind the router db to the app
server.db = router.db;

server.use(middlewares);

const rules = auth.rewriter({
    users: 640,
    shareholder: 660,
    event: 660,
    vote: 660,
});

// This setup allows you to query directly like GET /event/2, but it only returns events where isDeleted is false.
server.get('/event/:id', (req, res) => {
    const event = router.db
        .get('event')
        .find({ id: Number(req.params.id), isDeleted: false })
        .value();
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ error: 'Event not found or deleted' });
    }
});

server.use(rules);
server.use(auth);
server.use(router);

server.listen(port);