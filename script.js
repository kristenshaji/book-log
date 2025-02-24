// Firebase Configuration & Book Log Functionality

const firebaseConfig = {
    apiKey: "AIzaSyA5IM05om6Tc-KJbdwY7ZcEErdDfmTyumw",
    authDomain: "booklogapp-35f3d.firebaseapp.com",
    projectId: "booklogapp-35f3d",
    storageBucket: "booklogapp-35f3d.firebasestorage.app",
    messagingSenderId: "24118991140",
    appId: "1:24118991140:web:7a425a990d223fd847fbb1",
    measurementId: "G-S2QR34013J"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const booksRef = db.ref('books');
  
// DOM Element References
  const bookForm = document.getElementById('bookForm');
  const titleInput = document.getElementById('titleInput');
  const authorInput = document.getElementById('authorInput');
  const genreInput = document.getElementById('genreInput');
  const ratingInput = document.getElementById('ratingInput');
  const bookList = document.getElementById('bookList');

    // Get references to filter-related elements
  const genreFilterSelect = document.getElementById("genre-filter");
  const authorFilterSelect = document.getElementById("author-filter");
  const filterBtn = document.getElementById('filterBtn');
  const filterOptions = document.getElementById('filterOptions');


// Toggle the filter options menu when the Filter button is clicked.
filterBtn.addEventListener('click', () => {
    filterOptions.style.display = (filterOptions.style.display === 'block') ? 'none' : 'block';
  });
  
  // When an option is clicked in the dropdown:
  filterOptions.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
      const filterType = e.target.getAttribute('data-filter');
      if (filterType === 'genre') {
        // Reset author filter and show genre filter
        authorFilterSelect.value = "All";
        genreFilterSelect.style.display = 'inline-block';
        authorFilterSelect.style.display = 'none';
      } else if (filterType === 'author') {
        // Reset genre filter and show author filter
        genreFilterSelect.value = "All";
        authorFilterSelect.style.display = 'inline-block';
        genreFilterSelect.style.display = 'none';
      }
      // Hide the filter options after selection.
      filterOptions.style.display = 'none';
      // Re-render the books based on the new filter value.
      renderBooks(booksData);
    }
  });
  









  

// =========================
// Notification Function
// =========================

  function showNotification(message, duration = 3000) {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.textContent = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, duration);
    } else {
      // Fallback to alert if notification element is not found.
      alert(message);
    }
  }



// =========================
// Global Storage for Book Data
// =========================
let booksData = [];



// =========================
// Render Books Function (with Filtering)
// =========================
function renderBooks(books) {
    const genreFilter = genreFilterSelect.value;
    const authorFilter = authorFilterSelect.value;
  
    // Filter books based on the selected genre and author.
    const filteredBooks = books.filter(book => {
      const genreMatch = (genreFilter === "All" || book.genre === genreFilter);
      const authorMatch = (authorFilter === "All" || book.author === authorFilter);
      return genreMatch && authorMatch;
    });
  
    // Clear the current table body.
    bookList.innerHTML = '';
  
    // Populate the table with the filtered books.
    filteredBooks.forEach(book => {
      const row = document.createElement('tr');
  
      // Title cell
      const titleCell = document.createElement('td');
      titleCell.textContent = book.title;
      row.appendChild(titleCell);
  
      // Author cell
      const authorCell = document.createElement('td');
      authorCell.textContent = book.author;
      row.appendChild(authorCell);
  
      // Genre cell
      const genreCell = document.createElement('td');
      genreCell.textContent = book.genre;
      row.appendChild(genreCell);
  
      // Rating cell
      const ratingCell = document.createElement('td');
      ratingCell.textContent = book.rating;
      row.appendChild(ratingCell);
  
      // Action cell with Edit and Delete buttons
      const actionCell = document.createElement('td');
      
      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('edit-btn');
      editBtn.style.marginRight = "10px";
      editBtn.onclick = () => editBook(book.id, book);
      actionCell.appendChild(editBtn);
      
      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.onclick = () => deleteBook(book.id);
      actionCell.appendChild(deleteBtn);
  
      row.appendChild(actionCell);
      bookList.appendChild(row);
    });
  }
  
  // =========================
  // Populate Filter Dropdowns
  // =========================
  function populateFilters(books) {
    const genres = new Set();
    const authors = new Set();
  
    books.forEach(book => {
      if (book.genre) genres.add(book.genre);
      if (book.author) authors.add(book.author);
    });
  
    // Populate Genre Filter
    genreFilterSelect.innerHTML = '<option value="All">All Genres</option>';
    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      genreFilterSelect.appendChild(option);
    });
  
    // Populate Author Filter
    authorFilterSelect.innerHTML = '<option value="All">All Authors</option>';
    authors.forEach(author => {
      const option = document.createElement('option');
      option.value = author;
      option.textContent = author;
      authorFilterSelect.appendChild(option);
    });
  }
  
  // =========================
  // Listen for Firebase Book Data Updates
  // =========================
  booksRef.on('value', (snapshot) => {
    booksData = [];
    snapshot.forEach(childSnapshot => {
      const book = childSnapshot.val();
      book.id = childSnapshot.key; // Save the unique ID
      booksData.push(book);
    });
    renderBooks(booksData);
    populateFilters(booksData);
  });

  



// =========================
// Book Form Submission
// =========================
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const genre = genreInput.value.trim();
    const rating = ratingInput.value.trim();

    if (title && author && genre && rating) {
      const newBookRef = booksRef.push();
      newBookRef.set({
        title,
        author,
        genre,
        rating: Number(rating),
        timestamp: Date.now()
      }, (error) => {
        if (error) {
            showNotification("Failed to add book.", 4000);
        } else {
            showNotification("Book added successfully!");
            // Clear inputs after successful addition
            titleInput.value = '';
            authorInput.value = '';
            genreInput.value = '';
            ratingInput.value = '';
        }
    });
  }
});



// =========================
// Listen for Firebase Book Data Updates
// =========================
booksRef.on('value', (snapshot) => {
    bookList.innerHTML = ''; // Clear the table before updating

    snapshot.forEach(childSnapshot => {
        const book = childSnapshot.val();
        const row = document.createElement('tr'); // Create a new row

        // Title cell
        const titleCell = document.createElement('td');
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        // Author cell
        const authorCell = document.createElement('td');
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        // Genre cell
        const genreCell = document.createElement('td');
        genreCell.textContent = book.genre;
        row.appendChild(genreCell);

        // Rating cell
        const ratingCell = document.createElement('td');
        ratingCell.textContent = book.rating;
        row.appendChild(ratingCell);

        // Action cell with Edit and Delete buttons
        const actionCell = document.createElement('td');

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.style.marginRight = "10px";
        editBtn.onclick = () => editBook(childSnapshot.key, book);
        actionCell.appendChild(editBtn);

        actionCell.appendChild(document.createTextNode(' ')); // Space between buttons

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn'); // Add CSS class for styling
        deleteBtn.onclick = () => deleteBook(childSnapshot.key);
        actionCell.appendChild(deleteBtn);

        row.appendChild(actionCell);
        bookList.appendChild(row);
    });
});

// =========================
// Edit Book Function
// =========================
function editBook(id, book) {
    const newTitle = prompt("Edit book title:", book.title);
    const newAuthor = prompt("Edit author name:", book.author);
    const newGenre = prompt("Edit genre:", book.genre);
    const newRating = prompt("Edit rating (1-5):", book.rating);
  
    if (newTitle && newAuthor && newGenre && newRating) {
      db.ref('books/' + id).update({
        title: newTitle,
        author: newAuthor,
        genre: newGenre,
        rating: Number(newRating)
      }, (error) => {
        if (error) {
          showNotification("Failed to update book.", 4000);
        } else {
          showNotification("Book updated successfully!");
        }
      });
    }
  }


  

// =========================
// Delete Book Function
// =========================
function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
        db.ref('books/' + id).remove((error) => {
            if (error) {
                showNotification("Failed to delete book.", 4000);
            } else {
                showNotification("Book deleted successfully!");
            }
        });
    }
}


// =========================
// Filter Change Event Listeners
// =========================
genreFilterSelect.addEventListener("change", () => renderBooks(booksData));
authorFilterSelect.addEventListener("change", () => renderBooks(booksData));

  
  // =========================
  // Gemini API Chatbot Integration
  // =========================
  
  // Gemini API configuration – using your provided key and endpoint.
  const GEMINI_API_KEY = 'AIzaSyCkon-Ce4v5P7rPz6lRoq0aWUZvPbzOzTg';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  
  // Function to generate a response from the Gemini API
  async function generateResponse(prompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });
  
    if (!response.ok) {
      throw new Error('Failed to generate response');
    }
  
    const data = await response.json();
    // Adjust this extraction according to the Gemini API's exact response structure.
    return data.candidates[0].content.parts[0].text;
  }
  
  // Function to clean up markdown (if needed)
  function cleanMarkdown(text) {
    return text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  // =========================
  // Chatbot UI Functionality (Floating Chat Icon & Window)
  // =========================
  
  // Element references for chat UI.
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const chatIcon = document.getElementById('chatIcon');
  const chatWindowContainer = document.getElementById('chatWindowContainer');
  const closeChatBtn = document.getElementById('closeChat');
  
  // Add a new message to the chat window.
  function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
  
    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
    profileImage.alt = isUser ? 'User' : 'Bot';
  
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
  
    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Handle user input, get the Gemini response, and display it.
  async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, true);
      userInput.value = '';
      sendButton.disabled = true;
      userInput.disabled = true;
      try {
        const botMessage = await generateResponse(userMessage);
        addMessage(cleanMarkdown(botMessage), false);
        showNotification("Response received successfully!");
      } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', false);
        showNotification("Error generating response.", 4000);
      } finally {
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
      }
    }
  }
  
  // Event listeners for sending messages.
  sendButton.addEventListener('click', handleUserInput);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  });
  
  // =========================
  // Chat Window Toggling (Floating Chat Icon)
  // =========================
  
  // Show chat window when the chat icon is clicked.
  chatIcon.addEventListener("click", () => {
    chatWindowContainer.style.display = "flex";
  });
  
  // Hide chat window when the close button is clicked.
  closeChatBtn.addEventListener("click", () => {
    chatWindowContainer.style.display = "none";
  });

  



  
// =========================
// Biometric Registration (Creates a Passkey)
// =========================
async function registerPasskey() {
    if (!window.PublicKeyCredential) {
      alert("WebAuthn is not supported on this browser. Try a different device.");
      return;
    }
  
    try {
      // Generate a secure challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
  
      // Register new passkey
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: { name: "Book Log App" }, // Website/App name
          user: {
            id: new Uint8Array(16), // Unique user ID
            name: "Alvin", // Your username
            displayName: "Alvin Ondieki"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { userVerification: "required" },
          timeout: 60000
        }
      });
  
      console.log("Passkey Registered:", credential);
      alert("Passkey (fingerprint) registered successfully!");
    } catch (error) {
      console.error("Passkey registration failed:", error);
      alert("Registration failed: " + error.message);
    }
  }
  
  // Call this function when the user clicks "Register Biometrics"
  document.getElementById("registerBtn").addEventListener("click", registerPasskey);

  
// =========================
// Unified Biometric Authentication (WebAuthn Fingerprint Authentication)
// =========================

let isAuthenticationPending = false; // Prevent multiple authentication requests

async function authenticateWithBiometrics() {
    if (!window.PublicKeyCredential) {
        alert("WebAuthn is not supported on this browser. Try a different device.");
        return;
    }

    // Prevent multiple authentication requests
    if (isAuthenticationPending) {
        console.warn("A biometric authentication request is already in progress.");
        return;
    }

    isAuthenticationPending = true; // Mark request as pending

    try {
        console.log("Starting biometric authentication...");

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // WebAuthn request
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: challenge,
                timeout: 30000, // 30 seconds timeout
                allowCredentials: [], // Use any registered credential
                userVerification: "required" // Forces biometric verification
            }
        });

        if (credential) {
            console.log("Biometric Authentication Successful:", credential);
            alert("Biometric authentication successful!");
        } else {
            alert("Authentication failed. Please try again.");
        }
    } catch (error) {
        console.error("Authentication failed:", error);

        if (error.name === "AbortError" || error.name === "NotAllowedError") {
            alert("Authentication request was canceled or not allowed.");
        } else {
            alert("Authentication failed: " + error.message);
        }
    } finally {
        isAuthenticationPending = false; // Reset authentication state
    }
}

// Attach event listener to login button (Remove duplicates)
document.getElementById("loginBtn").addEventListener("click", authenticateWithBiometrics);
