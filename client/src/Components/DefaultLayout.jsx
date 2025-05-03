import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const handleLogOut = async () => {
    let confirmLogout = confirm("Are you sure you want to log out?");

    if(!confirmLogout){
      return;
    }

    try{
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type" : "application/json"
        },
      })


      if (response.status == 400) {
        const error = await response.json();
        toast.error(`${error.message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
        return;
      }

      const data = await response.json();
      toast.success(`${data.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      navigate("/");
      dispatch(logout());


    } catch(err) {
      console.log(err);
      toast.error(`Server Error - Please Try again later.`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }
  
  } 

  return (
    <>
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <h1 className="text-3xl text-white">Connect</h1>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium text-xl flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to={"/"}
                className="block py-3 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={"/about"}
                className="block py-3 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                aria-current="page"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={"/profile"}
                className="block py-3 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                aria-current="page"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to={"/chat"}
                className="block py-3 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                aria-current="page"
              >
                Chat
              </Link>
            </li>
            <div>
              <button className="text-base bg-white rounded px-3 py-[5px] mr-2">
                {isLoggedIn ? <p onClick={handleLogOut}>LOG OUT</p> : <Link to={"/login"}>LOGIN</Link>}
              </button>
              {!isLoggedIn && <button className="text-base bg-white rounded px-3 py-[5px]"><Link to={"/signup"}>SIGN UP</Link></button> }
            </div>
          </ul>
        </div>
      </div>
    </nav>
    <ToastContainer />
    <Outlet />
    <Footer />
    </>
  );
}
