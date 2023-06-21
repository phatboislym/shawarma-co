import { Link, useNavigate } from "react-router-dom"
import * as yup from "yup";
import {useEffect, useState} from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { SignUpType } from "../../types/models";
import { Spinner } from "../../components/Spinner";
import { useAppDispatch } from "../../state-control/store/hooks";
import { registerUser } from "../../state-control/features/authSlice";


const registerSchema = yup.object().shape({
  full_name: yup.string().required("First name is required"),
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Passeord length should be at least 4 characters")
    .max(12, "Password should not exceed more than 12 Characters"),
  // confirm_password: yup
  //   .string()
  //   .required("Confirm password is required")
  //   .oneOf([yup.ref("password")], "password do not match"),
  username: yup.string()
});


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const initialValue = {
    email: "",
    password: "",
    full_name: "",    
    username: ""
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    // reset,
  } = useForm<SignUpType>({
    resolver:  yupResolver(registerSchema),
    defaultValues: initialValue,
  });

  const handleRegister:SubmitHandler<SignUpType> = async (values, e) => {
    e?.preventDefault();
    setErrorMessage('');

    try {
      // const submitResponse = await dispatch(registerUser(values));
      // if(submitResponse.)
      dispatch(registerUser(values)).then((resultAction) => {
        if (registerUser.fulfilled.match(resultAction)) {
          if (resultAction.payload.status_code === 400){
            setErrorMessage(resultAction.payload.detail)
          }else {
            Swal.fire({
              position: "top-end",
              title: "Account created Successfully",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
              });
            setTimeout(() => {
              navigate("/login");
            }, 2000);            
          }
        }
      }); 
    } catch (error) {
      setErrorMessage('An error occurred during registration.');
    }
  }

  useEffect(() => {
    setFocus("full_name");
  }, [setFocus]);



  return (
    <>
    <h1 className="text-4xl md:ml-16">Sign Up</h1>
    <section className="">
      <div className="container h-full px-3 py-24">
      <div
        className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
        {/* <!-- Left column container with background--> */}
        <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="w-full"
            alt="Phone image" />
        </div>

        {/* <!-- Right column container with form --> */}
        <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
        {errorMessage && (
            <div className='bg-red-600 text-white p-4 mb-2'>
              {" "}
              {errorMessage}{" "}
            </div>
          )}
            {isLoading && <Spinner />} 
          <form  onSubmit={handleSubmit(handleRegister)}>
            {/* <!-- Email input --> */}
            <div className="relative mb-6">
              <label
                htmlFor="exampleFormControlInput3"
                className=""
                >Email address
              </label>
              <input
                type="text"
                {...register("email")}
                className="border-0 mb-3 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Email address" />
            </div>
            {/* <!-- First input --> */}
            <div className="relative mb-6">
              <label
                htmlFor="exampleFormControlInput3"
                className=""
                >Full Name
              </label>
              <input
                type="text"
                {...register("full_name")}
                className="border-0 mb-3 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="John Doe" />
                <p className="mb-3 text-red-600">{errors.full_name?.message}</p>
            </div>
            {/* <!-- Email input --> */}
            <div className="relative mb-6">
              <label
                htmlFor="exampleFormControlInput3"
                className=""
                >Email address
              </label>
              <input
                type="text"
                {...register("email")}
                className="border-0 mb-3 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="mail@address.com" />
                <p className="mb-3 text-red-600">{errors.email?.message}</p>
            </div>
            {/* <!-- User input --> */}
            <div className="relative mb-6">
              <label
                htmlFor="exampleFormControlInput3"
                className=""
                >Username
              </label>
              <input
                type="text"
                {...register("username")}
                className="border-0 mb-3 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="johndoe" />
                <p className="mb-3 text-red-600">{errors.username?.message}</p>
            </div>            

            {/* <!-- Password input --> */}
            <div className="relative mb-6">
              <label
                htmlFor=""
                >Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="border-0 mb-3 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150
                "
                id="exampleFormControlInput33"
                placeholder="Password" />
                <p className="mb-3 text-red-600">{errors.password?.message}</p>
            </div>
         

            {/* <!-- Submit button --> */}
            <button
              type="submit"
              className=" bg-gray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
            >
              Sign Up
            </button>

            <p className="mt-3">Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link></p>

            {/* <!-- Divider --> */}
            {/* <div
              className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
              <p
                className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                OR
              </p>
            </div> */}

            {/* <!-- Social login buttons --> */}
            {/* <a
              className="mb-3 flex w-full items-center justify-center rounded bg-primary px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              style={{backgroundColor:"#3b5998"}}
              href="#!"
              role="button"
              data-te-ripple-init
              data-te-ripple-color="light">
                
              {/* <!-- Facebook --> 
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Continue with Facebook
            </a> */}
            {/* <a
              className="mb-3 flex w-full items-center justify-center rounded bg-info px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(84,180,211,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)]"
              style={{backgroundColor: "#55acee"}}
              href="#!"
              role="button"
              data-te-ripple-init
              data-te-ripple-color="light">
              {/* <!-- Twitter --> 
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Continue with Twitter
            </a> */}
          </form>
        </div>
      </div>
      </div>
    </section>
  </>
  )
}

export default Register