import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthModal({ toggleModal }) {
  const { account, loading } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  useEffect(() => {
    // go to main app when logged in
    if (account && !loading) toggleModal();
  }, [account, loading]);

  return (
    <Modal clickClose={toggleModal}>
      {isLogin ? (
        <LoginForm toggleLogin={toggleLogin} />
      ) : (
        <RegisterForm toggleLogin={toggleLogin} />
      )}
    </Modal>
  );
}

export default AuthModal;
