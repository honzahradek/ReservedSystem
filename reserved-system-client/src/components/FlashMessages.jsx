import React from "react";

export function FlashMessage({ theme, text }) {
  return <div className={"alert alert-" + theme + " alert-dismissible fade show"}>
    <strong>{text}</strong>
    <button type="button" className="btn-close" data-bs-dismiss="alert" arial-label="Close"></button>
  </div>;
}

export default FlashMessage;
