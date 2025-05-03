import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../Auth_Components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password, cpassword } = formData;
    if (!name || !email || !password || !cpassword) {
      toast.warning("Please Provide all the Information.", {
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

    if (password !== cpassword) {
      toast.error("Password Does Not Match", {
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

    try {
      console.log(apiUrl);
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status != 200) {
        const error = await response.json();
        throw new Error(error.message);
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
      navigate("/login");


    } catch (err) {
      console.log(err);
      toast.error(`${err}`, {
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
    } finally{
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="h-[750px] bg-gradient-to-tl from-red-400 to-indigo-950 flex justify-center items-center">
        <div className="lg:w-1/3 md:w-1/2 w-2/3">
          <form className="bg-white p-10 rounded-lg shadow-lg min-w-full">
            <h1 className="text-center text-2xl mb-2 text-gray-600 font-bold font-sans">
              Sign Up
            </h1>
            <p className="text-center text-gray-600">
              Already Have an Account?{" "}
              <Link to={"/login"} className="underline hover:text-gray-800">
                Login
              </Link>
            </p>

            <div>
              <label
                className="text-gray-800 font-semibold block my-2 text-md"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="email"
                name="email"
                id="email"
                placeholder="@email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="confirm"
              >
                Confirm password
              </label>
              <input
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="confirm password"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
              onClick={handleSubmit}
            >
              {!loading ? <p>Register</p> : <p>Loading..</p>} 
            </button>
            <button
              type="reset"
              className="w-full mt-6 mb-3 bg-indigo-100 rounded-lg px-4 py-2 text-lg text-gray-800 tracking-wide font-semibold font-sans"
            >
              Reset
            </button>

            <OAuth />

          </form>
        </div>
      </div>
    </section>
  );
}
