import {User} from "../model/user";
import api from "./api";

export const findUserByUsername = async (username: string): Promise<User> => {
    const response = await api.get(`/user/${username}`);

    return response.data;
};
