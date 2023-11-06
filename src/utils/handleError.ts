import { toast } from "react-toastify";

export function handleError(error: any) {
  if (error?.message) {
    toast.error(error?.message);
  } else if (error?.data?.message) {
    toast.error(error?.data?.message);
    if (Array.isArray(error?.data.message)) {
      toast.error(error?.data?.message.join(", "));
    } else {
      toast.error(error?.data?.message);
    }
  }
}
