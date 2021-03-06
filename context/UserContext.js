import styles from "../styles/Home.module.css";
import { createContext, useState, useEffect, useCallback } from "react";
export const UserContext = createContext();
import { Spinner } from "../components/Spinner";
import axios from "axios";

import { useRouter } from "next/router";

const UserProvider = (props) => {
  const router = useRouter();

  const [typeToOperation, setTypeToOperation] = useState({
    typeOperation: "",
    balance: "",
  });
  const [messageErrorUser, setMessageErrorUser] = useState("");

  const [clientInfo, setClientInfo] = useState({});

  const [user, setUser] = useState({});

  const [loading, setLoading] = useState();

  const getUsers = useCallback(async () => {
    setLoading(true);

    const client = {
      dni: user.numberDni.join(""),
      clave: user.numberPassword.join(""),
    };

    const url = `api/users/${client.dni}`;

    try {
      const response = await axios.get(url);

      setClientInfo(response.data);
      if (Number(clientInfo.clave) === Number(client.clave)) {
        setUser({});
        router.push("/operacion/index");
        setTimeout(() => setLoading(false), 4000);
        setMessageErrorUser("");
      } else {
        setLoading(false);
        setMessageErrorUser("Datos Incorrectos");
      }
    } catch (error) {
      setTimeout(() => {
        setMessageErrorUser(error.response.data.message);
        setLoading(false);
      }, 3000);
    }
  }, [clientInfo, router, user.numberPassword, user.numberDni]);

  useEffect(() => {
    if (user.numberDni) {
      getUsers();
    }
  }, [getUsers, user]);

  if (loading) {
    return (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        setUser,
        user,
        setLoading,
        messageErrorUser,
        clientInfo,
        setClientInfo,
        setTypeToOperation,
        typeToOperation,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
