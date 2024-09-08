import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeecode, setEmployeecode] = useState("");
  const [department, setDepartment] = useState("");
  const [timings, setTimings] = useState("");

  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Kuch Bhi "
            label={"Name"}
          />
          <InputBox
            type="text"
            onChange={(e) => {
              setDesignation(e.target.value);
            }}
            placeholder="Engineer"
            label={"Designation"}
          />
          <InputBox
            type="text"
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
            placeholder="tech"
            label={"Department"}
          />
          <InputBox
            type="text"
            onChange={(e) => {
              setEmployeecode(e.target.value);
            }}
            placeholder="14134"
            label={"Employee Code"}
          />
          <InputBox
            type="text"
            onChange={(e) => {
              setTimings(e.target.value);
            }}
            placeholder="8 - 10"
            label={"Timings"}
          />
          <InputBox
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="kuchbhi@gmail.com"
            label={"Email"}
          />
          <InputBox
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />

          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post(
                  "https://13.127.77.225/api/v1/user/signup",
                  {
                    name,
                    email,
                    password,
                    designation,
                    employeecode,
                    timings,
                    department,
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
