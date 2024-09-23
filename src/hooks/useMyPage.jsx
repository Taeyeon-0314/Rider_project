import { useInView } from "react-intersection-observer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { updateProfile } from "../api/auth";

const useMyPage = (hasNextPage, isFetchingNextPage, fetchNextPage) => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const { ref: myFeedRef } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (!inView || !hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    }
  });

  const confirmUpdate = () =>
    Swal.fire({
      icon: "warning",
      title: "닉네임 변경",
      input: "text",
      inputAttributes: {
        placeholder: `이전 닉네임: ${user.nickname}`
      },
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "confirm-button-class",
        cancelButton: "cancel-button-class",
        input: "input-field-class"
      },
      preConfirm: async (nickname) => {
        if (!nickname) {
          Swal.showValidationMessage("닉네임을 입력해주세요!");
          return;
        }

        try {
          const { setUser } = useUserStore.getState();
          const response = await updateProfile({ nickname });

          if (!response.success) {
            return Swal.showValidationMessage(`Error: ${response.data.message}`);
          }

          setUser({
            ...user,
            nickname: response.nickname
          });
          return response.data;
        } catch (error) {
          if (error.response && error.response.status === 401) {
            Swal.fire({
              icon: "error",
              title: `로그인 만료\n다시 로그인해주세요!`,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              navigate("/login");
            });
            return Promise.reject(error);
          } else {
            Swal.fire({
              icon: "error",
              title: "서버 연결 실패",
              showConfirmButton: false,
              timer: 1500
            });
            return Promise.reject(error);
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value}으로\n변경되었습니다!`
        });
      }
      return result.value;
    });

  return { myFeedRef, confirmUpdate };
};

export default useMyPage;
