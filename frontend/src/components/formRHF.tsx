import { useForm } from "react-hook-form";
import Modal, { type Styles } from "react-modal";

import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useShallow } from "zustand/shallow";

import useStore from "../hooks/store";
import styles from "../styles/style.module.css";
import { URL_DATA } from "../utils/env";
import { getInitData } from "../utils/helperFns";
import { type Form, formSchema } from "../utils/schema";

const modalStyles: Styles = {
  overlay: {
    backdropFilter: "blur(2px)",
    overflowY: "scroll",
  },
  content: {
    background: "#033452",
    overflowY: "auto",
    width: "80%",
    margin: "2rem auto",
    height: "fit-content",
    borderRadius: "0.75rem",
    borderColor: "#48536B",
    padding: "2rem",
  },
};

const FormRHF = () => {
  const [open, setOpen, fetchUsers] = useStore(
    useShallow((state) => [state.openRHF, state.setOpenRHF, state.fetchUsers]),
  );

  const rhf = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitData(),
    mode: "onTouched",
    // mode: "onSubmit", // Don't forget to remove button disabled logic to make it clickable.
  });
  const { register, handleSubmit, watch, reset, setValue, formState } = rhf;
  const { errors, isSubmitting, isValid } = formState;
  // console.log({
  //   a_rhf: rhf,
  //   b_formState: formState,
  //   c_watch: watch(),
  //   d_register: register("firstName"),
  // });

  async function sendData(data: Form) {
    try {
      await axios.post(URL_DATA, data);
      setOpen(false);
      fetchUsers();
      reset(getInitData());
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div id="form">
      <Modal isOpen={open} style={modalStyles}>
        <form
          onSubmit={handleSubmit(sendData)}
          className="flex flex-col gap-2 items-start"
        >
          <h1>Form (React Hook Form)</h1>
          <div className={styles.formWrapper}>
            <div className="grid">
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  {...register("firstName")}
                  type="text"
                  id="firstName"
                  disabled={isSubmitting}
                  className={styles.noMB}
                />
                <ErrorMessage
                  errors={errors}
                  name="firstName"
                  as={<div className={styles.formError} />}
                />
                {/* {errors.firstName?.message ?? ""} */}
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  {...register("lastName")}
                  type="text"
                  id="lastName"
                  disabled={isSubmitting}
                  className={styles.noMB}
                />
                <ErrorMessage
                  errors={errors}
                  name="lastName"
                  as={<div className={styles.formError} />}
                />
              </div>
            </div>

            <div className="grid">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  {...register("email")}
                  type="text"
                  id="email"
                  disabled={isSubmitting}
                  className={styles.noMB}
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  as={<div className={styles.formError} />}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  {...register("dateOfBirth")}
                  type="text"
                  id="dateOfBirth"
                  disabled={isSubmitting}
                  className={styles.noMB}
                />
                <ErrorMessage
                  errors={errors}
                  name="dateOfBirth"
                  as={<div className={styles.formError} />}
                />
              </div>
            </div>

            <div className="grid">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  disabled={isSubmitting}
                  className={styles.noMB}
                />
                <ErrorMessage
                  errors={errors}
                  name="password"
                  as={<div className={styles.formError} />}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  id="confirmPassword"
                  disabled={isSubmitting}
                  className={styles.noMB}
                />
                <ErrorMessage
                  errors={errors}
                  name="confirmPassword"
                  as={<div className={styles.formError} />}
                />
              </div>
            </div>

            <div className="grid" style={{ alignItems: "start" }}>
              {/* Submit Button with OnTouch Validation */}
              <button type="submit" disabled={isSubmitting || !isValid}>
                {formState.isSubmitting ? "Working" : "Submit"}
              </button>

              {/* Submit Button with OnSubmit Validation */}
              {/* <button type="submit">
                {formState.isSubmitting ? "Working" : "Submit"}
              </button> */}
              <button
                onClick={() => {
                  setOpen(false);
                  reset(getInitData());
                }}
                disabled={isSubmitting}
                className="secondary"
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FormRHF;
