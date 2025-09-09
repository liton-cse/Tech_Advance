type Notification = {
  id: string;
  title: string;
  message: string;
  link: string; // content URL
};

let notifications: Notification[] = [];

export const createNotification = (headers: any, body: any): Notification => {
  const id = Date.now().toString();

  const notification: Notification = {
    id,
    title: body.title || 'Default Title',
    message: body.message || 'Default Message',
    link: body.link || 'https://example.com',
  };

  notifications.push(notification);
  return notification;
};

export const getNotificationById = (id: string): Notification | undefined => {
  return notifications.find(n => n.id === id);
};
