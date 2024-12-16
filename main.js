// main.js
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Zatrzymanie domyślnego wysyłania formularza

  // Pobranie danych z formularza
  const experience = document.getElementById("experience").value;
  const iHavePet = document.querySelector('input[name="IHavepet"]').checked;
  const iAmSmoking = document.querySelector('input[name="IAmsmoking"]').checked;
  const iAmVegan = document.querySelector('input[name="IAmvegan"]').checked;
  const iWantOvernightStay = document.querySelector(
    'input[name="IWantovernightStay"]'
  ).checked;

  // Utworzenie obiektu zapytania
  const searchParams = new URLSearchParams({
    value: experience,
    IHavepet: iHavePet,
    IAmsmoking: iAmSmoking,
    IAmvegan: iAmVegan,
    IWantovernightStay: iWantOvernightStay,
  });

  // Wysłanie zapytania do serwera
  fetch(`http://localhost:3000/families?${searchParams.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Tutaj dodaj kod do wyświetlania wyników wyszukiwania na stronie

      // main.js
      document
        .getElementById("search-form")
        .addEventListener("submit", function (e) {
          e.preventDefault(); // Zatrzymanie domyślnego wysyłania formularza

          // Pobranie danych z formularza
          const experience = document.getElementById("experience").value;
          const iHavePet = document.querySelector(
            'input[name="IHavepet"]'
          ).checked;
          const iAmSmoking = document.querySelector(
            'input[name="IAmsmoking"]'
          ).checked;
          const iAmVegan = document.querySelector(
            'input[name="IAmvegan"]'
          ).checked;
          const iWantOvernightStay = document.querySelector(
            'input[name="IWantovernightStay"]'
          ).checked;

          // Utworzenie obiektu zapytania
          const searchParams = new URLSearchParams({
            value: experience,
            IHavepet: iHavePet,
            IAmsmoking: iAmSmoking,
            IAmvegan: iAmVegan,
            IWantovernightStay: iWantOvernightStay,
          });

          // Wysłanie zapytania do serwera
          fetch(`http://localhost:3000/families?${searchParams.toString()}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              // Tutaj dodaj kod do wyświetlania wyników wyszukiwania na stronie
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
