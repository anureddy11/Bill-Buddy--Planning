import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import SideNavigation from "../components/SideNavigation";
import Navigation from "../components/Navigation/Navigation";
import "./Layout.css"; // Import the CSS file

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        <div className="layout-container">
          {isLoaded && sessionUser && <SideNavigation />}
          <main className="main-content">
            {isLoaded && <Outlet />}
          </main>
        </div>
        <Modal />
      </ModalProvider>
    </>
  );
}
