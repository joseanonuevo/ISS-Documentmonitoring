document.querySelector("tbody").addEventListener("click", function (event) {
  if (event.target.className === "disable-row-btn") {
    disableRowById(event.target.dataset.id);
  }
  if (event.target.className === "enable-row-btn") {
    enableRowById(event.target.dataset.id);
  }
});
function disableRowById(id) {
  Swal.fire({
    icon: "warning",
    title: "Are you sure you want to disable this user?",
    confirmButtonText: `Yes`,
    confirmButtonColor: "#FFA627",
    showCancelButton: true,
    cancelButtonColor: "#C4C4C4",
    reverseButtons: true,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch("https://iss-emonitor/disable/" + id, {
        method: "PATCH",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "User Disabled!",
              confirmButtonText: `Done`,
              confirmButtonColor: "#FFA627",
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        });
    }
  });
}
function enableRowById(id) {
  Swal.fire({
    icon: "warning",
    title: "Are you sure you want to enable this user?",
    confirmButtonText: `Yes`,
    confirmButtonColor: "#FFA627",
    showCancelButton: true,
    cancelButtonColor: "#C4C4C4",
    reverseButtons: true,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch("https://iss-emonitor/enable/" + id, {
        method: "PATCH",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "User Enabled!",
              confirmButtonText: `Done`,
              confirmButtonColor: "#FFA627",
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        });
    }
  });
}
