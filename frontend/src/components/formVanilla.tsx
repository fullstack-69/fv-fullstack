import { type ChangeEvent, type FC, useEffect, useState } from "react";
import Modal, { type Styles } from "react-modal";

import axios from "axios";
import { useShallow } from "zustand/shallow";

import useStore from "../hooks/store";
import { URL_DATA } from "../utils/env";
import { getInitData } from "../utils/helperFns";
import { formSchema } from "../utils/schema";

const modalStyles: Styles = {
  overlay: {
    backdropFilter: "blur(2px)",
    overflowY: "scroll",
  },
  content: {
    background: "#181C25",
    width: "80%",
    height: "fit-content",
    margin: "2rem auto",
    borderRadius: "0.75rem",
    borderColor: "#48536B",
    padding: "2rem",
  },
};

const FormVanilla: FC = () => {
  const [open, setOpen, fetchUsers] = useStore(
    useShallow((state) => [state.openVN, state.setOpenVN, state.fetchUsers]),
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    e.target.id === "firstName" && setFirstName(e.target.value);
    e.target.id === "lastName" && setLastName(e.target.value);
    e.target.id === "email" && setEmail(e.target.value);
    e.target.id === "dateOfBirth" && setDateOfBirth(e.target.value);
    e.target.id === "password" && setPassword(e.target.value);
    e.target.id === "confirmPassword" && setConfirmPassword(e.target.value);
  }

  useEffect(() => {
    const initData = getInitData();
    setFirstName(initData.firstName);
    setLastName(initData.lastName);
    setEmail(initData.email);
    setDateOfBirth(initData.dateOfBirth);
    setPassword(initData.password);
    setConfirmPassword(initData.confirmPassword);
  }, [open]);

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDateOfBirth("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }
  // For inspection
  const values = {
    firstName,
    lastName,
    email,
    dateOfBirth,
    password,
    confirmPassword,
  };

  async function sendData(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = formSchema.safeParse(values);
    if (!result.success) {
      console.log(result);
      const errMsg = result.error.issues
        .map((el) => `• [${String(el.path[0])}] - ${el.message}`)
        .join("\n");
      setError(errMsg);
      return;
    }

    try {
      await axios.post(URL_DATA, values);
      setOpen(false);
      fetchUsers();
      reset();
    } catch (err: any) {
      console.log(err);
      setError(err?.message || "Error sending data");
    }
  }

  return (
    <div id="form">
      <Modal isOpen={open} style={modalStyles}>
        <form onSubmit={sendData}>
          <h1>Form (Vanilla)</h1>
          <div className="grid">
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="grid">
            <div>
              <label htmlFor="email">Email</label>
              <input type="text" id="email" value={email} onChange={onChange} />
            </div>

            <div>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="text"
                id="dateOfBirth"
                value={dateOfBirth}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="grid">
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>

          {/* {JSON.stringify(values)} */}
          <pre className="pico-color-red-300">{error}</pre>

          <div className="grid" style={{ alignItems: "start" }}>
            <button type="submit">Submit</button>
            <button
              className="secondary"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FormVanilla;
