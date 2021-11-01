"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const cors_1 = __importDefault(require("cors"));
const tracks_routes_config_1 = require("./tracks/tracks.routes.config");
const debug_1 = __importDefault(require("debug"));
const constant_1 = require("./constant");
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = 4000;
const routes = [];
const debugLog = (0, debug_1.default)("app");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true })),
};
if (!constant_1.DEBUG) {
    loggerOptions.meta = false;
}
app.use(expressWinston.logger(loggerOptions));
routes.push(new tracks_routes_config_1.TrackRoutes(app));
app.get("/", (_req, res) => {
    res.status(200).send('Welcome');
});
server.listen(port, () => {
    routes.forEach((route) => {
        route.configureRoutes();
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map