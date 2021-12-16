import axios from "axios";

// create api config (needs the token on most requests)
const Axios = (token) => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default Axios;
