self.addEventListener("push", function (event) {
  const data = event.data.json();

  const options = {
    body: data.message,
    icon: "https://adarsh555a.github.io/Adarsh-gupta/happy/logo-removebg-preview.png",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});