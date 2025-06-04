$(document).ready(function () {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "user_login.php") {
    loginUser();
  }
  if (currentPage === "register.html") {
    handleUserRegistration();
  }

  if (currentPage === "index.php") {
    fetchStudentData();
  }

  if (currentPage === "task-maker.php") {
    handleTaskAdd();
    fetchTaskData();
    handleTaskEdit();
  }
  if (currentPage === "std-dashb.php") {
    handleStudentSubmissions();
  }

  fetchLoggedInUserData();
  handleProfileEditTrigger();
  enableProfileEditing();
  handleProfileFormSubmission();
  handleLogout(); // Logout functionality can be global
});

function loginUser() {
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    let formData = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    $.ajax({
      url: "login.php",
      type: "POST",
      dataType: "json",
      data: formData,
    })
      .done(function (response) {
        console.log(response);

        if (response.res === "success") {
          window.location.href = "index.php";
        } else {
          alert("Login failed: " + response.msg);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error: ", textStatus, errorThrown);
        alert("An error occurred while processing your request.");
      });
  });
}

// Fetch and display logged-in user data
function fetchLoggedInUserData() {
  $.ajax({
    url: "logged_user.php",
    type: "POST",
    dataType: "json",
  })
    .done(function (data) {
      if (data && data.first_name && data.last_name) {
        $(".user-name").text(`${data.first_name} ${data.last_name}`);
        const profileSrc =
          data.profile && data.profile.trim() !== ""
            ? data.profile
            : "profiles/default.jpg";
        $(".profile-img").attr("src", profileSrc);
      } else {
        console.error("Invalid user data received");
        $(".profile-img").attr("src", "profiles/default.jpg");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching user data: ", textStatus, errorThrown);
      $(".profile-img").attr("src", "profiles/default.jpg");
    });
}

function fetchStudentData() {
  const adminUserIds = [40, 1, 2]; // Add all admin user_ids you want to exclude here

  $.ajax({
    url: "user_data.php",
    type: "GET",
    dataType: "json",
  })
    .done(function (data) {
      if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid or empty student data received");
        return;
      }

      let template = document.querySelector("#productTemplate");
      let parent = document.querySelector("#tableBody");
      parent.innerHTML = "";

      let verifiedCount = 0;

      data.forEach((item) => {
        if (!item.user_id || adminUserIds.includes(item.user_id)) {
          // Skip admins by user_id
          return;
        }

        let clone = template.content.cloneNode(true);
        clone.querySelector(".fname").textContent = item.first_name || "N/A";
        clone.querySelector(".lname").textContent = item.last_name || "N/A";
        clone.querySelector(".course").textContent = item.course || "N/A";
        clone.querySelector(".address").textContent = item.address || "N/A";

        let statusElement = clone.querySelector(".status");
        if (item.is_verified == 1) {
          statusElement.textContent = "Verified";
          statusElement.classList.add("verified");
          verifiedCount++;
        } else {
          statusElement.textContent = "Unverified";
          statusElement.classList.add("unverified");
        }

        parent.appendChild(clone);
      });

      document.getElementById("verifiedUsersCount").textContent = verifiedCount;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching student data: ", textStatus, errorThrown);
    });
}


// Handle user registration form submission
function handleUserRegistration() {
  $("#registerUser").submit(function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    $.ajax({
      url: "register.php",
      type: "POST",
      dataType: "json",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (result) {
        if (result.res === "success") {
          alert("Verification Request Sent");
          window.location.reload();
        } else {
          alert("Failed to Request Verification: " + result.msg);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error: ", textStatus, errorThrown);
      });
  });
}

//handle student submissions
function handleStudentSubmissions() {
  $("#submissionForm").submit(function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    $.ajax({
      url: "std-submit.php",
      type: "POST",
      dataType: "json",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (result) {
        if (result.res === "success") {
          alert("Submitted Successfully");
          window.location.reload(); // Reload the page to reflect changes
        } else {
          alert("Failed to Submit: " + result.msg);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error: ", textStatus, errorThrown);
        alert("An error occurred while submitting. Please try again.");
      });
  });
}

// Enable profile editing in the modal
function enableProfileEditing() {
  document
    .getElementById("enableEditButton")
    .addEventListener("click", function () {
      const inputs = document.querySelectorAll(
        "#editProfileForm input, #editProfileForm select"
      );
      inputs.forEach((input) => {
        input.disabled = false;
      });

      document.getElementById("saveChangesButton").disabled = false;
      this.disabled = true;
    });
}

// Handle profile form submission
function handleProfileFormSubmission() {
  $("#editProfileForm").submit(function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    $.ajax({
      url: "user_update.php", // Endpoint to update user data
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (response) {
        if (response.success) {
          alert("Profile updated successfully!");
          location.reload();
        } else {
          alert("Failed to update profile: " + response.message);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error updating profile: ", textStatus, errorThrown);
      });
  });
}

// Handle logout functionality
function handleLogout() {
  $(".logout-btn").click(function () {
    $.ajax({
      url: "logout.php", // Endpoint to handle logout
      type: "POST",
    })
      .done(function () {
        window.location.href = "user_login.php"; // Redirect to login page
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error during logout: ", textStatus, errorThrown);
      });
  });
}

//Handle Task Assignment
function handleTaskAdd() {
  $("#addTask").submit(function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    $.ajax({
      url: "task-add.php",
      type: "POST",
      dataType: "json",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (result) {
        if (result.res === "success") {
          alert("Task Assigned Successfully");
          window.location.reload();
          $("#addTask")[0].reset();
        } else {
          alert("Failed to assign task: " + result.msg);
        }
      })
      .fail(function (_jqXHR, textStatus, errorThrown) {
        console.error("AJAX error: ", textStatus, errorThrown);
      });
  });
}

// Fetch and populate profile data in the modal when triggered
function handleProfileEditTrigger() {
  document
    .querySelector(".profile-edit-trigger")
    .addEventListener("click", function () {
      $.ajax({
        url: "get_user_profile.php", // Endpoint to fetch user profile data
        type: "POST",
        dataType: "json",
        success: function (data) {
          if (data) {
            $("#fname").val(data.first_name);
            $("#lname").val(data.last_name);
            $("#email").val(data.email);
            $("#address").val(data.address);
            $("#gender").val(data.gender);
            $("#birthdate").val(data.birthdate);

            const profileSrc =
              data.profile && data.profile.trim() !== ""
                ? data.profile
                : "profiles/default.jpg";
            $("#profilePreview").attr("src", profileSrc);
          } else {
            alert("Failed to load user data.");
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching user data:", error);
        },
      });
    });
}

function fetchTaskData() {
  $.ajax({
    url: "task-data-get.php",
    type: "GET",
    dataType: "json",
    success: function (data) {
      const tableBody = document.getElementById("tableBody");

      // Clear existing rows
      tableBody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML =
          "<tr><td colspan='5' class='text-center'>No tasks available</td></tr>";
        return;
      }

      data.forEach((item) => {
        const template = document.querySelector("#taskTemplate");
        const clone = template.content.cloneNode(true);
      
        // Set task_id in the data-id attribute
        const row = clone.querySelector("tr");
      
        // Populate data attributes
        row.setAttribute("data-id", item.task_id);
        row.setAttribute("data-assigned-students", item.assigned_students);
        console.log("Task ID from backend:", item.task_id);
      
        // Populate other fields
        clone.querySelector(".tname").textContent = item.task_name || "N/A";
        clone.querySelector(".tdesc").textContent = item.task_desc || "N/A";
        clone.querySelector(".duedate").textContent = item.task_deadline || "N/A";
      
        const statusElement = clone.querySelector(".status-tag");
        statusElement.textContent = item.task_status || "N/A";
      
        // Add status-specific classes
        if (item.task_status === "pending") {
          statusElement.classList.add("pending");
        } else if (item.task_status === "completed") {
          statusElement.classList.add("completed");
        } else if (item.task_status === "overdue") {
          statusElement.classList.add("overdue");
        }
      
        // Append the cloned row to the table body
        tableBody.appendChild(clone);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching task data:", error);
    },
  });
}

function handleTaskEdit() {
        $("#editTaskForm").submit(function (event) {
      event.preventDefault();
    
      const formData = new FormData(this);
    
      $.ajax({
        url: "update-tasks.php", // Backend endpoint to update the task
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
          if (response.success) {
            alert(response.message);
            $("#editTaskModal").modal("hide"); // Close the modal
            fetchTaskData(); // Refresh the task list
          } else {
            alert("Failed to update task: " + response.message);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error updating task:", error);
          alert("An error occurred while updating the task. Please try again.");
        },
      });
    });
}
