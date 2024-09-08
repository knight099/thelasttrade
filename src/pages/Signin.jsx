/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const response = await axios.post(
        "https://13.127.77.225/api/v1/user/signin",
        {
          email,
          password,
        }
      );
      const { token, role } = response.data;

      localStorage.setItem("token", token);

      if (role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            type="text"
            placeholder="kuchbhi@gmail.com"
            label={"Email"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <InputBox
            type="password"
            placeholder="1234kuchbhi56"
            label={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="pt-4">
            <Button label={"Sign in"} onClick={handleSignin} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
