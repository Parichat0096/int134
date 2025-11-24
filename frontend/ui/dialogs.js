// ui/dialogs.js
import {
  dialogOk,
  dialogOkMsg,
  dialogOkBtn,
  dialogConfirm,
  dialogConfirmMsg,
  dialogConfirmCancelBtn,
  dialogConfirmKeepBtn,
} from "./elements.js";

export function showDialog(msg) {
  dialogOkMsg.textContent = msg;
  dialogOk.showModal();
}

dialogOkBtn.addEventListener("click", () => dialogOk.close());

export function showConfirm(message, onConfirm) {
  dialogConfirmMsg.textContent = message;
  dialogConfirm.showModal();

  dialogConfirmCancelBtn.onclick = () => {
    dialogConfirm.close();
    onConfirm(true);
  };

  dialogConfirmKeepBtn.onclick = () => dialogConfirm.close();
}
