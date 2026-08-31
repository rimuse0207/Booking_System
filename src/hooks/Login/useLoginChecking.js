import { useDispatch } from "react-redux";
import { Request_Get_Axios } from "../../API";
import { Logout_Inistate_State_Func } from "../../models/LoginInfoReducer/LoginInfoReduce";

export const useLoginChecking = () => {
  const dispatch = useDispatch();
  const LoginTokenChecking = async () => {
    try {
      const res = await Request_Get_Axios("/Login/LoginChecking");
      if (res.status) {
        if (!res.data.LoginChecking) {
          dispatch(Logout_Inistate_State_Func());
        }
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
