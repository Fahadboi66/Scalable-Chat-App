import { useDispatch, useSelector } from "react-redux";
import {  useRef, useState } from "react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from "react-icons/fa";
import { logout, updateProfile } from "../features/user/userSlice.js";


import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Auth_Components/firebase.js";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const [newImageUrl, setNewImageUrl] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [formData, setFormData] = useState({ name: userDetails?.name || "", email: userDetails?.email || "", oldPassword: "", newPassword: "", imageUrl: "" });
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("Cannot upload this file.");
      return;
    }
    const storage = getStorage(app);
    const fileName = userDetails.name + "_" + new Date().getTime().toString();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },

      (error) => {
        toast.error(`Cannot upload the Image due to some error.`, {
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
        console.log(error);
        return;
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setNewImageUrl(downloadURL);
          setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrl: downloadURL
          }));
          toast.success(`Image Uploaded Successfully`, {
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
          setUploadProgress(null);
        });
      }
    );
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }


  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const { name, email, oldPassword, newPassword, imageUrl } = formData;

    if (!name || !email) {
      toast.error(`Please provide name and email.`, {
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

    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        toast.error(`Please provide both passwords OR Leave both empty`, {
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
    } else{
      formData.oldPassword = undefined;
      formData.newPassword = undefined;
    }

    if(imageUrl === "") {
      formData.imageUrl = undefined;
    }

      try {
        const response = await fetch(`${apiUrl}/api/user/update/${userDetails._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        })

        if (response.status == 404) {
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
        dispatch(updateProfile(data.userDetails));
        toast.success(`Profile Updated Successfully`, {
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


      } catch (err) {
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



  const handleDelete = async (e) => {
    e.preventDefault();
    let ask = confirm("Are you sure you want to delete your profile? Note that it cannot be restored again.")
    if(!ask){
      return;
    }

    try{
      const response = await fetch(`${apiUrl}/api/user/delete/${userDetails._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type" : "application/json"
        },
      })

      if (response.status == 404) {
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
      
      dispatch(logout());
      navigate("/");


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
    <section>
      {/* Create by joker banny */}
      <div className="h-[1000px] bg-indigo-100 flex justify-center items-center">
        <div className="lg:w-1/3 md:w-1/2 w-2/3">
          <form className="bg-white p-10 rounded-lg shadow-lg min-w-full">
            <h1 className="text-center text-2xl mb-2 text-gray-600 font-bold font-sans">
              Your Profile
            </h1>
            <p className="text-center text-gray-600">
              You can update your profile here
            </p>

            <div className="w-full flex align-middle justify-center mt-3 " onClick={() => inputRef.current.click()}>
              <img
                className="rounded-full object-cover w-32 h-32"

                src={newImageUrl !== undefined ? newImageUrl : userDetails?.image}
                alt="profile_image"
              />
              <FaCamera className="text-2xl absolute mt-[112px] cursor-pointer  text-blue-700" />
            </div>

            <div className="w-full align-middle justify-center ml-10 hidden">
              <input
                type="file"
                accept="image/png, image/jpeg"
                name="avatar"
                ref={inputRef}
                onChange={handleImage}
              />
            </div>

            {uploadProgress ? <div className="w-full flex align-middle justify-center mt-7">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div> : <></>}

            <div onClick={handleDelete} className="w-full flex align-middle justify-center mt-6">
              <button className="bg-red-600 text-white py-2 px-3 rounded-lg">Delete Account</button>
            </div>

            <div>
              <label
                className="text-gray-800 font-semibold block my-2 text-md"
                htmlFor="name"
              >
                Name:
              </label>
              <input
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                defaultValue={userDetails?.name}
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="email"
                id="email"
                placeholder="@email"
                defaultValue={userDetails?.email}
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="password"
              >
                Current Password:
              </label>
              <input
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="oldPassword"
                id="password"
                placeholder="old password"
              />
            </div>
            <div>
              <label
                className="text-gray-800 font-semibold block my-3 text-md"
                htmlFor="password"
              >
                New Password:
              </label>
              <input
                onChange={handleChange}
                className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="newPassword"
                id="password2"
                placeholder="password"
              />
            </div>

            <button
              onClick={handleUpdateUser}
              type="submit"
              className="w-full mt-6 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-semibold font-sans"
            >
              Update
            </button>
            <button
              type="reset"
              className="w-full mt-6 mb-3 bg-indigo-100 rounded-lg px-4 py-2 text-lg text-gray-800 tracking-wide font-semibold font-sans"
            >
              cancel
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
