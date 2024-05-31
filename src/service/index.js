import httpHelper from "../utils/httpHelper";
import { appConfig } from "../constants/appConfig";

export const service = {
    async getQuestions() {
        return httpHelper.makeGetRequest(appConfig.baseUrl, '/posts');
    },
};
