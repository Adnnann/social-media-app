import axios from "axios";
export const searchUsersApi = async (queryTerm) => {
  console.log("queryTerm", queryTerm.length);

  try {
    const response = await axios.post(`/users/search/${queryTerm}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
