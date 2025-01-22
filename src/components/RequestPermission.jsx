'use client';

export default function RequestPermissionButton() {
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.error('Notification permission denied.');
    }
  };

  return <button onClick={requestPermission}>Enable Notifications</button>;
}
