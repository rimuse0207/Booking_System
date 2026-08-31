import { useState, useCallback, useRef, useEffect } from "react";
import moment from "moment";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export const OFFICE_STRUCTURE = {
  "판교 사업장": [6],
  "아산 사업장": [3],
};

const INITIAL_BOXES = [
  {
    id: 1,
    office: "판교 사업장",
    floor: 6,
    type: "user",
    x: 40,
    y: 100,
    width: 70,
    height: 45,
    name: "유성재",
    email: "sjyoo@dhk.co.kr",
    department: "개발 1팀",
    status: "출근",
  },

  // 💡 테스트용 공간 데이터 3종 (ROOM, EQUIPMENT, DISABLE)
  {
    id: 2,
    office: "판교 사업장",
    floor: 6,
    type: "room",
    x: 40,
    y: 170,
    width: 230,
    height: 100,
    label: "대회의실 A",
    identifier: "ROOM_A",
  },
  {
    id: 3,
    office: "판교 사업장",
    floor: 6,
    type: "room",
    x: 290,
    y: 170,
    width: 120,
    height: 100,
    label: "공용 3D 프린터",
    identifier: "EQUIPMENT_PRINTER",
  },
  {
    id: 4,
    office: "판교 사업장",
    floor: 6,
    type: "room",
    x: 430,
    y: 170,
    width: 100,
    height: 100,
    label: "비품 창고",
    identifier: "DISABLE_STORAGE",
  },
];

export const useFloorLayout = () => {
  const [boxes, setBoxes] = useState([]);
  const [backupBoxes, setBackupBoxes] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  const [selectedOffice, setSelectedOffice] = useState("판교 사업장");
  const [currentFloor, setCurrentFloor] = useState(6);
  const [currentDate, setCurrentDate] = useState(moment());

  const offices = Object.keys(OFFICE_STRUCTURE);
  const availableFloors = OFFICE_STRUCTURE[selectedOffice] || [6];

  const dragInfo = useRef({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    boxId: null,
    initialX: 0,
    initialY: 0,
    initialW: 0,
    initialH: 0,
  });

  const goPrevDay = () =>
    setCurrentDate((prev) => moment(prev).subtract(1, "days"));
  const goNextDay = () => setCurrentDate((prev) => moment(prev).add(1, "days"));
  const changeDate = (dateString) => {
    if (dateString) setCurrentDate(moment(dateString));
  };

  useEffect(() => {
    const getFloorData = async () => {
      try {
        const req = await Request_Get_Axios("/LayoutApp/getFloorLayout", {
          selectedOffice,
          currentFloor,
          currentDate: currentDate.format("YYYY-MM-DD"),
        });

        setBoxes(req.data);
      } catch (error) {
        console.error("배치도 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    getFloorData();
    // eslint-disable-next-line
  }, [currentDate, selectedOffice, currentFloor]);

  const toggleEditMode = () => {
    setBackupBoxes(boxes);
    setIsEditMode(true);
  };

  const saveLayout = async () => {
    if (window.confirm("수정된 자리배치도를 저장하시겠습니까?")) {
      try {
        const req = await Request_Post_Axios("/LayoutApp/saveFloorLayout", {
          boxes,
          currentFloor,
          selectedOffice,
        });
        if (req.status) {
          alert("배치도가 성공적으로 저장되었습니다.");
          setIsEditMode(false);
          setSelectedBox(null);
        } else {
          alert("저장에 실패했습니다.");
        }
      } catch (error) {
        alert("저장 중 서버 오류가 발생했습니다.");
      }
    }
  };

  const cancelEditMode = () => {
    setBoxes(backupBoxes);
    setIsEditMode(false);
    setSelectedBox(null);
  };

  const handleOfficeChange = (officeName) => {
    setSelectedOffice(officeName);
    const floors = OFFICE_STRUCTURE[officeName] || [1];
    setCurrentFloor(floors[0]);
    setSelectedBox(null);
  };

  const handleDragStart = (e, box) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setSelectedBox(box.id);
    dragInfo.current = {
      isDragging: true,
      isResizing: false,
      startX: e.clientX,
      startY: e.clientY,
      boxId: box.id,
      initialX: box.x,
      initialY: box.y,
    };
  };

  const handleResizeStart = (e, box) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setSelectedBox(box.id);
    dragInfo.current = {
      isDragging: false,
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      boxId: box.id,
      initialW: box.width,
      initialH: box.height,
    };
  };

  const handleMouseMove = useCallback((e) => {
    const info = dragInfo.current;
    if (!info.isDragging && !info.isResizing) return;
    const dx = e.clientX - info.startX;
    const dy = e.clientY - info.startY;

    setBoxes((prev) =>
      prev.map((b) => {
        if (b.id !== info.boxId) return b;
        if (info.isDragging)
          return {
            ...b,
            x: Math.round((info.initialX + dx) / 10) * 10,
            y: Math.round((info.initialY + dy) / 10) * 10,
          };
        if (info.isResizing)
          return {
            ...b,
            width: Math.max(40, Math.round((info.initialW + dx) / 10) * 10),
            height: Math.max(30, Math.round((info.initialH + dy) / 10) * 10),
          };
        return b;
      }),
    );
  }, []);

  const handleMouseUp = useCallback(() => {
    dragInfo.current.isDragging = false;
    dragInfo.current.isResizing = false;
  }, []);

  const updateBoxProperty = (id, key, value) => {
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)),
    );
  };

  const deleteBox = (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      setBoxes((prev) => prev.filter((b) => b.id !== id));
      setSelectedBox(null);
    }
  };

  const addNewBox = (type) => {
    const newBox = {
      id: Date.now(),
      office: selectedOffice,
      floor: currentFloor,
      type,
      x: 40,
      y: 40,
      width: type === "user" ? 50 : 150,
      height: type === "user" ? 75 : 150,
      label: type === "user" ? "" : "새 공간",
      name: "",
      email: "",
      department: "",
      status: "",
      identifier: type === "user" ? "" : `ROOM_${Date.now()}`,
      isOccupied: false,
      occupantName: "",
      endTime: "",
      reservations: [],
    };
    setBoxes((prev) => [...prev, newBox]);
    setSelectedBox(newBox.id);
  };

  return {
    state: {
      boxes,
      isEditMode,
      selectedBox,
      selectedOffice,
      currentFloor,
      offices,
      availableFloors,
      currentDate,
    },
    actions: {
      toggleEditMode,
      saveLayout,
      cancelEditMode,
      handleOfficeChange,
      setCurrentFloor,
      handleDragStart,
      handleResizeStart,
      handleMouseMove,
      handleMouseUp,
      setSelectedBox,
      addNewBox,
      updateBoxProperty,
      deleteBox,
      goPrevDay,
      goNextDay,
      changeDate,
    },
  };
};
