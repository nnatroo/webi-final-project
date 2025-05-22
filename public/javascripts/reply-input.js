document.addEventListener("DOMContentLoaded", function() {
    const replyButtons = document.querySelectorAll(".reply-btn");

    replyButtons.forEach(button => {
        button.addEventListener("click", () => {
            console.log("clicked");
            const textArea = this.nextElementSibling;

            textArea.classList.toggle("show");
        })
    })
})