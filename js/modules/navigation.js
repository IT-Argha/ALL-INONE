export function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewName = button.dataset.view;
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected view
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${viewName}-view`) {
                    view.classList.add('active');
                }
            });
        });
    });
}