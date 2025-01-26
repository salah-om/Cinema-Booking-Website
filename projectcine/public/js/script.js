

    /*
    -------------------------------------------------------------------------
      Purpose: Validates the login credentials in the front-end side.
      Parameters: Event in which user tries to logs in.
      Postcondition: Returns boolean validation for incorrect inputs.
    -------------------------------------------------------------------------
    */
async function checkForm(event) { 
    event.preventDefault(); // Prevent default form submission

    // Get form values
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("pass").value;
    let cnfrmPassword = document.getElementById("cpass").value;
    let message = document.getElementById("message");

    if (!fname || !lname || !email || !password || !cnfrmPassword) { 
        message.textContent = "Please fill in all required fields."; 
        message.style.color = "red"; 
        return false;
    }
    
    // Validate passwords
    if (password !== cnfrmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return false;
    }

    // Send data to backend
    try {

        const response = await fetch("/api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fname, lname, email, pass: password }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Display server error message
            message.textContent = result.message || "Email already registered.";
            message.style.color = "red";
            return false;
        }

        message.textContent = "Registration successful!";
        message.style.color = "green";
        document.querySelector("form").reset(); 
        return true;

    } catch (error) {
        console.error("Error during registration:", error);
        message.textContent = "An unexpected error occurred. Please try again.";
        message.style.color = "red";
        return false;
    }
}

/*
    -------------------------------------------------------------------------
      Purpose: Validates the login in terms of front-end side.
      Parameters: Event in which user logs in.
      Postcondition: Returns boolean validation for user redirection.
    -------------------------------------------------------------------------
    */
async function checkLogin(event) { 

    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("pass").value; 
    let message = document.getElementById("loginmsg"); 

    if (!email || !password) { 
        message.textContent = "Please fill in all required fields."; 
        message.style.color = "red"; 
        return false; 
    } 

    try { 

        const response = await fetch("/api/users/login", { 
            method: "POST", 
            headers: { 
                "Content-Type": "application/json", 
            }, 
            body: JSON.stringify({ email, pass: password }), 
        }); 

        const result = await response.json(); 

        if (!response.ok) { 
            message.textContent = result.message || "Incorrect Email or Password."; 
            message.style.color = "red"; 
            return false; 
        }  
        
        if(result.redirect) {
            window.location.href = result.redirect;
        }
        message.textContent = "Login successful!";
        message.style.color = "green";
        return true;

        } catch (error) { 
            console.error("Error during login:", error); 
            message.textContent = "An unexpected error occurred. Please try again."; 
            message.style.color = "red"; 
            return false; 
        }
}

    /*
    -------------------------------------------------------------------------
      Purpose: Displays the movies from the database with their information.
      Parameters: None.
      Postcondition: Returns cards to be displayed with movie information.
    -------------------------------------------------------------------------
    */
document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("movieList");

    // Fetch movies from the backend API
    fetch('/api/movies')
        .then(response => response.json())
        .then(movies => {
            // Clear the movie list container
            movieList.innerHTML = '';

            // Loop through the movie objects and create cards
            movies.forEach(movie => {
                const movieCard = ` 
                <div class="col-md-4"> 
                    <div class="movie-card"> 
                        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster"> 
                    <div class="movie-details"> 
                        <h5>${movie.title}</h5> 
                        <p><b>Genre:</b> ${movie.genre}</p> <p>
                        <b>Duration:</b> ${movie.duration} minutes</p> 
                        <p><b>Rating:</b> ${movie.rating}</p> <p>
                        <b>Language:</b> ${movie.lang}</p> <p>
                        <b>Screening:</b> ${movie.screening}</p> 
                        <a href="/api/seats/seating-plan/${movie.id}" class="btnbn">Book Now</a> 
                    </div> 
                    </div> 
                </div> `;
                movieList.innerHTML += movieCard;
            });
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            movieList.innerHTML = `<p class="text-center text-danger">Failed to load movies. Please try again later.</p>`;
        });
});

    /*
    -------------------------------------------------------------------------
      Purpose: Validates the user booking seats for incorrect inputs.
      Parameters: Event in which user books.
      Postcondition: Returns price calculation and alert if the user did a 
      mistake.
    -------------------------------------------------------------------------
    */
document.addEventListener("DOMContentLoaded", () => {
    const seatCheckboxes = document.querySelectorAll(".seat-checkbox");
    const totalPriceElement = document.getElementById("totalPrice");
    const bookingForm = document.querySelector("form.bookform");

    if (seatCheckboxes.length > 0 && totalPriceElement && bookingForm) {
        const pricePerSeat = 10;

        seatCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                const selectedSeats = Array.from(seatCheckboxes).filter(cb => cb.checked).length;
                totalPriceElement.textContent = selectedSeats * pricePerSeat;
            });
        });

        bookingForm.addEventListener("submit", (event) => {
            const selectedSeats = Array.from(seatCheckboxes).filter(cb => cb.checked);
            if (selectedSeats.length === 0) {
                event.preventDefault();
                alert("Please select at least one seat before confirming your booking.");
            } else {
                console.log("Selected seats:", selectedSeats);
            }
        });
    } else {
        if (seatCheckboxes.length === 0) {
            console.error("Seat checkboxes not found.");
        }
        if (!totalPriceElement) {
            console.error("Total price element not found.");
        }
        if (!bookingForm) {
            console.error("Booking form not found.");
        }
    }
});


  