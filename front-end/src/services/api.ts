import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://share--Publi-e28O0AIcCghh-1447109741.ap-southeast-1.elb.amazonaws.com/backend",
});

export default instance;
