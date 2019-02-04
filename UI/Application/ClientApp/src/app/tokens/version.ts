import { InjectionToken } from "@angular/core";

export const VERSION = new InjectionToken<any>("VERSION", {
    providedIn: "root",
    factory: (typeof window !== "undefined") ? window["VERSION"] : 0
});