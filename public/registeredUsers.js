document.querySelector("tbody").addEventListener("click", function (event) {
  if (event.target.className === "disable-row-btn") {
    disableRowById(event.target.dataset.id);
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
      fetch("http://localhost:3000/disable/" + id, {
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
