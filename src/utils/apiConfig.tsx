import axios from "axios";

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // CORS 오류나 네트워크 오류 시 error.response가 undefined일 수 있음
    if (error.response && error.response.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.clear();
      window.location.href = "/login";
    }

    // CORS 오류나 네트워크 오류 시 사용자에게 알림
    if (!error.response) {
      console.error('Network error or CORS issue:', error);
      if (error.message.includes('CORS') || error.code === 'ERR_NETWORK') {
        alert("CORS 정책으로 인해 요청이 차단되었습니다. 백엔드 서버 설정을 확인해주세요.");
      }
    }

    return Promise.reject(error);
  }
);
