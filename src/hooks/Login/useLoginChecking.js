import { Request_Get_Axios } from "../../API";

export const useLoginChecking = () => {
  const LoginTokenChecking = async () => {
    try {
      const res = await Request_Get_Axios("/Login/LoginChecking");
      if (res.status) {
        return res.data.LoginChecking;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    state: {},
    actions: { LoginTokenChecking },
  };
};
