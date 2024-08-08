import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import SideNavigation from "../components/SideNavigation";
import Navigation from "../components/Navigation/Navigation";
import "./Layout.css"; // Import the CSS file

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        <div className="layout-container">
          <SideNavigation />
          <main className="main-content">
            {isLoaded && <Outlet />}
          </main>
        </div>
        <Modal />
      </ModalProvider>
    </>
  );
}
