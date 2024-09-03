import { useSelector } from "react-redux";

const useUser = () => useSelector((state: any) => state.user);


export default useUser;
