import { useState, useMemo, useEffect } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    id: null,
    email: "",
    name: "",
    team: "",
  });

  useEffect(() => {
    getDHKUsers();
  }, []);

  const getDHKUsers = async () => {
    const req = await Request_Get_Axios("/UserAuth/getDHKUser");
    if (req.status) {
      setUsers(req.data);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchKeyword.trim()) return users;
    const lowerKeyword = searchKeyword.toLowerCase();
    return users.filter(
      (user) =>
        user.brity_works_user_info_name.toLowerCase().includes(lowerKeyword) ||
        user.brity_works_user_info_id.toLowerCase().includes(lowerKeyword) ||
        user.brity_works_user_info_token.toLowerCase().includes(lowerKeyword),
    );
  }, [users, searchKeyword]);

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      brity_works_user_info_indexs: null,
      brity_works_user_info_id: "",
      brity_works_user_info_name: "",
      brity_works_user_info_token: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setFormData({
      brity_works_user_info_indexs: user.brity_works_user_info_indexs,
      brity_works_user_info_id: user.brity_works_user_info_id,
      brity_works_user_info_name: user.brity_works_user_info_name,
      brity_works_user_info_token: user.brity_works_user_info_token,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newUser = { ...formData, brity_works_user_info_indexs: Date.now() };

      const saveNewUser = await Request_Post_Axios("/UserAuth/saveNewDHKUser", {
        newUser,
      });
      if (saveNewUser.status) {
        setUsers((prev) => [newUser, ...prev]);

        alert("사용자가 추가되었습니다.");

        closeModal();
      }
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (
      window.confirm(
        `정말로 '${name}' 사용자를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      )
    ) {
      const deleteDHKUser = await Request_Post_Axios(
        "/UserAuth/deleteDHKUser",
        {
          email: id,
        },
      );
      if (deleteDHKUser.status) {
        setUsers((prev) =>
          prev.filter((u) => u.brity_works_user_info_id !== id),
        );
        alert("삭제되었습니다.");
      } else {
        alert("오류 발생");
      }
    }
  };

  const handleResetPassword = async (email, name) => {
    if (
      window.confirm(
        `'${name}' 사용자의 비밀번호를 초기화하시겠습니까?\n(초기 비밀번호: 1234)`,
      )
    ) {
      const ResetPW = await Request_Post_Axios("/UserAuth/resetPwDHKUser", {
        email,
      });
      if (ResetPW.status) {
        alert("비밀번호가 '1234'로 초기화되었습니다.");
      } else {
        alert("오류 발생");
      }
    }
  };

  return {
    state: {
      users,
      searchKeyword,
      filteredUsers,
      isModalOpen,
      modalMode,
      formData,
    },
    actions: {
      setSearchKeyword,
      openAddModal,
      openEditModal,
      closeModal,
      handleFormChange,
      handleSaveUser,
      handleDeleteUser,
      handleResetPassword,
    },
  };
};
