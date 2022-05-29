import { createContext } from "react";

export const NotificationsContext = createContext({
    notificationsUnread: false,
    setNotificationsUnread: () => {}
});
