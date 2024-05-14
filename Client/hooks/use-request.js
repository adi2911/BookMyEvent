import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  //since ingress -> cluster-ip -> auth is running , we need to call api accordingly
  const doRequest = async () => {
    console.log("I was called");

    try {
      setErrors(null);
      const response = await axios[method](url, body);
      console.log("iiii", response);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (er) {
      console.log("errr", er);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops!!....</h4>
          <ul className="my-0">
            {er.response &&
              er.response.data.errors.map((err) => (
                <li key={err.message}>{err.message}</li>
              ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};
