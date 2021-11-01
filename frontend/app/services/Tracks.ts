import http from "../http-common";

class TracksDataService {
  getAll() {
    return http.get("/tracks");
  }

  postData(csvFile: any) {
    const formData = new FormData();
    formData.append("csvFile", csvFile);

    let axiosConfig = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    return http.post("/tracks", formData, axiosConfig);
  }
}

export default new TracksDataService();
