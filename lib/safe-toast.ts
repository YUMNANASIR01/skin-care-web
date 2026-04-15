import { toast as sonnerToast } from "sonner";

// Safe toast wrapper that prevents .custom errors
const safeToast = new Proxy(sonnerToast, {
  get(target, prop) {
    // Handle .custom by redirecting to .info
    if (prop === "custom") {
      return (message: any, data?: any) => target.info(message, data);
    }
    
    // Handle promise, success, error, info, warning
    if (prop === "promise" || prop === "success" || prop === "error" || 
        prop === "info" || prop === "warning" || prop === "loading") {
      return target[prop as keyof typeof target];
    }
    
    const value = (target as any)[prop];
    if (value === undefined) {
      // Return a no-op function for undefined methods
      return () => {};
    }
    return typeof value === "function" ? value.bind(target) : value;
  },
  apply(target, thisArg, args) {
    // Handle direct toast() calls
    return (target as any).apply(thisArg, args);
  },
});

export const toast = safeToast;
