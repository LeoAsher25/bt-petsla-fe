import { toast } from "react-toastify";

export function handleError(error: any) {
  toast.error(error.message);
}
