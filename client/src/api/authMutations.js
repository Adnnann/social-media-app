import axios from "axios";
import config from "./apiConfig";

export const login = async (values, onSubmitProps) => {
  const response = await axios.post(`${config.baseUrl}/auth/login`, values);

  return response.data;
};

export const register = async (values, onSubmitProps) => {
  const formData = new FormData();
  for (let value in values) {
    formData.append(value, values[value]);
  }
  formData.append("picturePath", values.picture.name);

  const response = await axios.post(
    `${config.baseUrl}/auth/register`,
    formData
  );
  return response.data;
};
