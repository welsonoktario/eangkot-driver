import { toastController } from "@ionic/vue";
import { checkmark, close, information } from "ionicons/icons";

type ToastColor = "danger" | "primary" | "success" | "warning" | undefined;

export const showToast = async (
  message: string,
  color: ToastColor = undefined
) => {
  let icon: string;

  switch (color) {
    case "danger":
      icon = close;
      break;
    case "success":
      icon = checkmark;
      break;
    case "warning":
      icon = information;
      break;
    default:
      break;
  }

  const toast = await toastController.create({
    animated: true,
    message,
    duration: 3000,
    icon,
    color,
    cssClass: "tabs-bottom",
    buttons: [
      {
        text: "OK",
        role: "cancel",
        handler: null,
      },
    ],
  });

  return await toast.present();
};
