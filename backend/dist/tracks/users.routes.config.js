"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
class UsersRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "UsersRoutes");
    }
    configureRoutes() {
        this.app
            .route(`/users`)
            .get((_req, res) => {
            res.status(200).send(`List of users`);
        })
            .post((_req, res) => {
            res.status(200).send(`Post to users`);
        });
        return this.app;
    }
}
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=users.routes.config.js.map