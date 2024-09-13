type Point = { x: number, y: number };
type Path = Point[];

const $ = <T extends HTMLElement>(selector: string) => document.querySelector(selector) as T;

const canvas = $<HTMLCanvasElement>('#canvas');
const submit = $<HTMLButtonElement>('#submit');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const paths: Path[] = [];

const LABELS = ['car', 'cat'];
const DATA: Path[] = [];
const LINE_WIDTH = 5;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

ctx.lineWidth = LINE_WIDTH;

let index = 0;
const updateLabelTitle = () => $('#label').textContent = `Please draw a ${LABELS[index]}...`;
const updateSubmitButton = () => submit.disabled = paths.length < 3;
const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

updateLabelTitle();
updateSubmitButton();

submit.onclick = () => {
    console.log(`Submitting ${LABELS[index]}`);

    if (DATA.length > LABELS.length) {
        console.error('Already submitted all data');
        return;
    }

    const data = paths.reduce((acc, path) => {
        acc.push(...path);
        return acc;
    });
    const elems = DATA.push(data);

    if (elems === LABELS.length) {
        const username = new URLSearchParams(location.search).get('username');
        const data = { username, labels: LABELS, images: DATA };
        $('#main').innerHTML = `
            <h1>Submitted all data</h1>
            <pre>${JSON.stringify(data, null, 4)}</pre>
        `;
        return;
    }

    paths.length = 0;
    index++;

    updateSubmitButton();
    updateLabelTitle();
    clearCanvas();
}

$<HTMLButtonElement>('#clear').onclick = () => {
    if (paths.length === 0) return;
    curr_path.length = paths.length = 0;
    updateSubmitButton();
    clearCanvas();
}

$<HTMLButtonElement>('#undo').onclick = () => {
    if (paths.pop() === undefined) return;

    updateSubmitButton();
    clearCanvas();

    if (paths.length === 0) return;
    ctx.beginPath();
    for (const path of paths) {
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
    }
    ctx.stroke();
}

let isDrawing = false;
let curr_path: Point[];
canvas.onpointerdown = ({ offsetX: x, offsetY: y }) => {
    isDrawing = true;
    curr_path = [{ x, y }];
}
canvas.onpointermove = ({ offsetX: x, offsetY: y }) => {
    if (!isDrawing) return;

    const { x: lastX, y: lastY } = curr_path[curr_path.length - 1];
    curr_path.push({ x, y });

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
}
document.onpointerup = () => {
    if (!isDrawing) return;

    isDrawing = false;
    paths.push(curr_path);

    updateSubmitButton();
}
