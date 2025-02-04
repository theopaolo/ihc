const dialogInteractions = () => {
    const dialog = document.querySelector("dialog");
    const openButton = document.querySelector(".dialog-open");
    const closeButton = document.querySelector("dialog button");

    // Error handling if elements don't exist
    if (!dialog || !openButton || !closeButton) {
        console.error("Dialog elements not found");
        return;
    }

    // Store the element that had focus before opening the dialog
    let previousActiveElement;
    // Store current transition
    let currentTransition = null;

    const positionDialog = () => {
        const buttonRect = openButton.getBoundingClientRect();
        const dialogRect = dialog.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate positions with margins
        const margin = 16;
        const left = Math.min(Math.max(margin, buttonRect.left), viewportWidth - dialogRect.width - margin);
        const top = buttonRect.top + buttonRect.height + dialogRect.height > viewportHeight
            ? Math.max(margin, buttonRect.top - dialogRect.height - margin)
            : Math.min(viewportHeight - dialogRect.height - margin, buttonRect.bottom + margin);

        // Apply positions
        dialog.style.position = 'absolute';
        dialog.style.left = `${left}px`;
        dialog.style.top = `${top}px`;
    };

    const openDialog = async () => {
        // Cancel any ongoing transition
        if (currentTransition) {
            currentTransition.skipTransition();
            currentTransition = null;
        }

        if (!document.startViewTransition) {
            previousActiveElement = document.activeElement;
            dialog.showModal();
            positionDialog();
            closeButton.focus();
            return;
        }

        // Use View Transitions API
        currentTransition = document.startViewTransition(() => {
            previousActiveElement = document.activeElement;
            dialog.showModal();
            positionDialog();
            closeButton.focus();
        });

        try {
            await currentTransition.finished;
        } finally {
            currentTransition = null;
        }
    };

    const closeDialog = async () => {
        // Cancel any ongoing transition
        if (currentTransition) {
            currentTransition.skipTransition();
            currentTransition = null;
        }

        if (!document.startViewTransition) {
            dialog.close();
            if (previousActiveElement) {
                previousActiveElement.focus();
            }
            return;
        }

        // Use View Transitions API
        currentTransition = document.startViewTransition(() => {
            dialog.close();
            if (previousActiveElement) {
                previousActiveElement.focus();
            }
        });

        try {
            await currentTransition.finished;
        } finally {
            currentTransition = null;
        }
    };

    // Click handlers
    openButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);

    // Handle native dialog cancel event (triggered by ESC key or clicking backdrop)
    dialog.addEventListener("cancel", (event) => {
        event.preventDefault(); // Prevent immediate closing
        closeDialog(); // Close with transition
    });

    // Prevent clicks on the dialog from bubbling to the backdrop
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeDialog();
        }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
        if (dialog.open) {
            positionDialog();
        }
    });
}

export default dialogInteractions;
