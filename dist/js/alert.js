export const showAlert = (type, message) => {
    const markup = `
    <main class="alertBox">
        <div class="message ${type}">${message}</div>
    </main>
    `
    document.querySelector('body').insertAdjacentHTML('afterend', markup);
    window.setTimeout(() => {
        const el = document.querySelector('.alertBox');
        el.parentElement.removeChild(el);
    }, 4000);
}