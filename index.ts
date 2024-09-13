const $ = <T extends HTMLElement>(selector: string) => document.querySelector(selector) as T;
const urlParams = new URLSearchParams(location.search);

const setTemplate = (selector: string) => {
    $('#main').appendChild($<HTMLTemplateElement>(selector).content.cloneNode(true));
}

if (urlParams.has('username')) {
    setTemplate('#draw');
} else {
    setTemplate('#login');
    $<HTMLButtonElement>('#start').onclick = () => {
        const username = $<HTMLInputElement>('#username').value;

        if (username.trim() === '') {
            alert('Please enter a username');
            return;
        }

        location.assign(`?username=${username}`);
    }
}

