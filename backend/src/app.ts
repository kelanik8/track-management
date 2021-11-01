import express from "express";
import * as http from "http";
import fileUpload from "express-fileupload";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { TrackRoutes as ConferenceTrackManagementRoutes } from "./tracks/tracks.routes.config";
import debug from "debug";
import { DEBUG } from "./constant";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 4000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());
app.use(cors());
app.use(fileUpload());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new ConferenceTrackManagementRoutes(app));

app.get("/", (_req: express.Request, res: express.Response) => {
  res.status(200).send('Welcome');
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    route.configureRoutes();
    debugLog(`Routes configured for ${route.getName()}`);
  });

  console.log(`Server running at http://localhost:${port}`);
});