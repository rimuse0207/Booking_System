export const LOGIN_INFO_APPLY_STATE_REDUCER_GET =
  "LOGIN_INFO_APPLY_STATE_REDUCER_GET";
export const LOGIN_INFO_INTIAL_STATE_REDUCER_GET =
  "LOGIN_INFO_INTIAL_STATE_REDUCER_GET";

const initState = {
  Login_Info: {
    id: "",
    name: "",
    company: "",
    admin_access: false,
  },
};

export const Login_Info_Apply_State_Func = (data) => ({
  type: LOGIN_INFO_APPLY_STATE_REDUCER_GET,
  payload: data,
});
export const Logout_Inistate_State_Func = () => ({
  type: LOGIN_INFO_INTIAL_STATE_REDUCER_GET,
});

const Login_Info_Reducer_State = (state = initState, action) => {
  switch (action.type) {
    case LOGIN_INFO_APPLY_STATE_REDUCER_GET:
      return {
        ...state,
        Login_Info: action.payload,
      };
    case LOGIN_INFO_INTIAL_STATE_REDUCER_GET:
      return initState;
    default:
      return state;
  }
};

export default Login_Info_Reducer_State;
