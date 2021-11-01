"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const TrackGenerator_1 = require("../utils/TrackGenerator");
const responseHandler_1 = require("../helpers/responseHandler");
class TrackRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "TracksRoutes");
    }
    configureRoutes() {
        this.app
            .route(`/tracks`)
            .post((req, res) => {
            try {
                if (!req.files) {
                    return (0, responseHandler_1.respondWithWarning)(res, 400, "No file uploaded");
                }
                else {
                    let file = req.files.csvFile;
                    if (!file.mimetype.includes("csv")) {
                        return (0, responseHandler_1.respondWithWarning)(res, 400, "Incorrect File Uploaded File");
                    }
                    const CSVtoString = file.data.toString();
                    const result = (0, TrackGenerator_1.generateTracks)(CSVtoString).map((track) => track.sessions);
                    return (0, responseHandler_1.respondWithSuccess)(res, 200, "Tracks generated successfully", result);
                }
            }
            catch (err) {
                console.log(err);
                return (0, responseHandler_1.respondWithWarning)(res, 400, "Error while reading file.");
            }
        });
        return this.app;
    }
}
exports.TrackRoutes = TrackRoutes;
//# sourceMappingURL=tracks.routes.config.js.map