import { createContext } from "react";

export const NotificationsContext = createContext({
    areNotificationsUnread: false,
    setAreNotificationsUnread: () => {}
});
