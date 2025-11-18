import { toast } from "sonner";

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

export const useToast = () => {
  const makeOpts = (opt: string | ToastOptions) =>
    typeof opt === "string"
      ? { message: opt }
      : {
          title: opt.title,
          description: opt.description,
          action: opt.action,
          duration: opt.duration,
        };

  return {
    success: (opt: string | ToastOptions) => {
      const o = makeOpts(opt);
      return typeof opt === "string"
        ? toast.success(opt)
        : toast.success(o.title || o.description || "Success", {
            description: o.description,
            action: o.action,
            duration: o.duration,
          });
    },

    error: (opt: string | ToastOptions) => {
      const o = makeOpts(opt);
      return typeof opt === "string"
        ? toast.error(opt)
        : toast.error(o.title || o.description || "Error", {
            description: o.description,
            action: o.action,
            duration: o.duration,
          });
    },

    info: (opt: string | ToastOptions) => {
      const o = makeOpts(opt);
      return typeof opt === "string"
        ? toast.message(opt)
        : toast.message(o.title || o.description || "Info", {
            description: o.description,
            action: o.action,
            duration: o.duration,
          });
    },

    warning: (opt: string | ToastOptions) => {
      const o = makeOpts(opt);
      return typeof opt === "string"
        ? toast.message(opt)
        : toast.message(o.title || o.description || "Warning", {
            description: o.description,
            action: o.action,
            duration: o.duration,
          });
    },

    loading: (message: string) => toast.loading(message),
    dismiss: (id?: string | number) => toast.dismiss(id),
    promise: <T>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) =>
      toast.promise(p, msgs),
  };
};
