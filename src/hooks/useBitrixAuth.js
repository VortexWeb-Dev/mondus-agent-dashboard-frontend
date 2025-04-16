import { useEffect, useState } from "react";
import axios from "axios";

export default function useBitrixAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const domain = params.get("domain");

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken) {
      // Try using access token
      fetchUser(accessToken, domain || import.meta.env.VITE_PORTAL_DOMAIN)
        .then((data) => finishAuth(data))
        .catch(() => {
          // Failed with access token → Try refresh
          if (refreshToken) {
            tryRefresh(refreshToken);
          } else {
            redirectToBitrix();
          }
        });
    } else if (refreshToken) {
      // No access token, try refresh
      tryRefresh(refreshToken);
    } else if (code && domain) {
      // Coming from Bitrix auth
      exchangeCode(code);
    } else {
      // Nothing saved, start login
      redirectToBitrix();
    }

    // ——— HELPERS ———

    async function fetchUser(token, domain) {
      return axios
        .get(`https://${domain}/rest/user.current?auth=${token}`)
        .then((res) => res.data.result);
    }

    function tryRefresh(refreshToken) {
      const payload = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        refresh_token: refreshToken,
      });

      axios
        .post(
          "https://apps.mondus.group/agent-dashboard-backend/?endpoint=bitrixAuth",
          payload,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((res) => {
          const { access_token, refresh_token, domain } = res.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          return fetchUser(
            access_token,
            domain || import.meta.env.VITE_PORTAL_DOMAIN
          );
        })
        .then((userData) => finishAuth(userData))
        .catch(() => redirectToBitrix());
    }

    function exchangeCode(code) {
      const payload = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      });

      axios
        .post(
          "https://apps.mondus.group/agent-dashboard-backend/?endpoint=bitrixAuth",
          payload,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((res) => {
          const { access_token, refresh_token, domain } = res.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          return fetchUser(access_token, domain);
        })
        .then((userData) => finishAuth(userData))
        .catch(() => redirectToBitrix());
    }

    function finishAuth(userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    function redirectToBitrix() {
      const authUrl = `https://${
        import.meta.env.VITE_PORTAL_DOMAIN
      }/oauth/authorize/?client_id=${
        import.meta.env.VITE_CLIENT_ID
      }&response_type=code&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;
      window.location.href = authUrl;
    }
  }, []);

  return { isLoading, isAuthenticated, user };
}
