import { useEffect, useState } from "react";
import moment from "moment";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const DUTY_PERSON_OPTIONS = [
  { value: "user2", label: "김철수 선임" },
  { value: "user3", label: "이영희 책임" },
];

const defaultPatrolContent =
  "보고사항 :\n주차내역 : B2 - 7대, B3 - 4대, B4 - 9대";

export const usePartyPost = () => {
  const [selectUser, setSelectUser] = useState(null);
  const [formData, setFormData] = useState({
    dutyDate: new Date(),
    patrols: [
      {
        id: 1,
        time: new Date(new Date().setHours(10, 0, 0, 0)),
        content: defaultPatrolContent,
      },
      {
        id: 2,
        time: new Date(new Date().setHours(13, 0, 0, 0)),
        content: defaultPatrolContent,
      },
      {
        id: 3,
        time: new Date(new Date().setHours(17, 0, 0, 0)),
        content: defaultPatrolContent,
      },
    ],
    inspectionDetails: `건물 출입 인원 : 
     
    6층:    명       (최종퇴실자: )`,
    specialNotes: "특이사항 없습니다.",
  });
  const [userListOptions, setUserListOptions] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    const req = await Request_Get_Axios("/PartyPost/getUserList");

    if (req.status) {
      setUserListOptions(req.data);
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, dutyPerson: selectedOption }));
  };

  const handlePatrolChange = (index, field, value) => {
    const newPatrols = [...formData.patrols];
    newPatrols[index][field] = value;
    setFormData((prev) => ({ ...prev, patrols: newPatrols }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      dutyDate: moment(formData.dutyDate).format("YYYY-MM-DD"),
      dutyPerson: formData.dutyPerson?.label,
      patrols: formData.patrols.map((p) => ({
        ...p,
        time: moment(p.time).format("HH:mm"),
      })),
    };
    const req = await Request_Post_Axios("/PartyPost/savePartyPost", {
      submitData,
      selectUser,
    });
    if (req.status) {
      if (!req.data.smsResult) {
        alert("메시지 전송 실패하였습니다. 개인 메세지로 발송 바랍니다.");
      }
      if (!req.data.mailResult) {
        alert("메시지 전송 실패하였습니다. 개인 메세지로 발송 바랍니다.");
      }
      if (req.data.smsResult && req.data.mailResult) {
        alert("메시지 전송 성공 고생 하셨습니다.");
      }
    }

    alert("당직일지가 성공적으로 등록되었습니다.");
  };

  return {
    state: { formData, userListOptions, selectUser },
    actions: {
      handleBasicChange,
      handleSelectChange,
      handlePatrolChange,
      handleSubmit,
      setSelectUser,
    },
  };
};
