import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { generateTracks } from "../utils/TrackGenerator";
import {
  respondWithSuccess,
  respondWithWarning,
} from "../helpers/responseHandler";
import { UploadedFile } from "express-fileupload";

export class TrackRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TracksRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/tracks`)
      .post((req: express.Request, res: express.Response) => {
        try {
          if (!req.files) {
            return respondWithWarning(res, 400, "No file uploaded");
          } else {
            let file = req.files.csvFile as UploadedFile;
            if (!file.mimetype.includes("csv")) {
              return respondWithWarning(
                res,
                400,
                "Incorrect File Uploaded File"
              );
            }

            const CSVtoString = file.data.toString();

            const result = generateTracks(CSVtoString).map(
              (track) => track.sessions
            );

            return respondWithSuccess(
              res,
              200,
              "Tracks generated successfully",
              result
            );
          }
        } catch (err) {
          console.log(err);
          return respondWithWarning(res, 400, "Error while reading file.");
        }
      });

    return this.app;
  }
}
