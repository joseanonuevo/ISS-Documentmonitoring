const PORT = "https://iss-emonitor.org";
//localhost:3000/archive
http: document
  .querySelector("tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "archive-row-btn") {
      archiveRowById(event.target.dataset.id);
    }
    //else if
    if (event.target.className === "delete-row-btn") {
      deleteRowById(event.target.dataset.id);
    }
    //else
    if (event.target.className === "update-row-btn") {
      updateRowById(event.target.dataset.id);
    }
  });
function archiveRowById(id) {
  Swal.fire({
    icon: "warning",
    title: "Are you sure you want to archive this document?",
    confirmButtonText: `Yes`,
    confirmButtonColor: "#FFA627",
    showCancelButton: true,
    cancelButtonColor: "#C4C4C4",
    reverseButtons: true,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch(PORT + "/archive/" + id, {
        method: "PATCH",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "File Archived!",
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

function deleteRowById(id) {
  Swal.fire({
    icon: "warning",
    title: "Are you sure you want to delete this document?",
    confirmButtonText: `Yes`,
    confirmButtonColor: "#FFA627",
    showCancelButton: true,
    cancelButtonColor: "#C4C4C4",
    reverseButtons: true,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch(PORT + "/delete/" + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "File Deleted!",
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
