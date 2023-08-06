let search = '';

let input = document.querySelector('input');
let block = document.querySelector('.block');
let newBlock = document.querySelector('.new-block');
let blockWrapper = document.querySelectorAll('.block-wrapper');
let exit = document.querySelector('button');

let map = new Map();

const debounce = (fn, debounceTime) => {
    let timeout;
    return function () {
        const fnCall = () => {
            fn.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime);
    };
};

input.addEventListener('keyup', debounce(creatFragment, 500));


async function getReposytories(search) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${search}`);
    return response.json();
}

async function creatFragment() {

    search = input.value;
    let j = await getReposytories(search);
    let section = document.querySelector('.element');

    if (section) {
        removeElement();
    }

    let fragment = new DocumentFragment();

    for (let i = 0; i <= 4; i++) {

        let section = document.createElement('div');
        section.classList.add('element');
        section.append(j.items[i].name);
        section.id = j.items[i].id;
        await map.set(section.id, j.items[i]);
        // await console.log(map);
        fragment.append(section);

    }

    block.append(fragment);
}

function removeElement() {
    let fiveElements = document.querySelectorAll('.element');
    fiveElements.forEach(e => e.remove());
}

block.addEventListener('click', (e) => {

    let target = e.target;
    console.log(target);
    createBlock(target.id);
    input.value = '';
    removeElement();
});

function createBlock(target) {
    let fragment = new DocumentFragment();
    let section = document.createElement('div');
    section.classList.add('block-wrapper');
    let leftBlock = document.createElement('div');
    leftBlock.classList.add('left-block');

    let name = document.createElement('div');
    name.classList.add('name');
    name.textContent = `Name: ${map.get(target).name}`;
    leftBlock.append(name);

    let owner = document.createElement('div');
    owner.classList.add('owner');
    owner.textContent = `Owner: ${map.get(target).owner.login}`;
    leftBlock.append(owner);

    let stars = document.createElement('div');
    stars.classList.add('stars');
    stars.textContent = `Stars: ${map.get(target).stargazers_count}`;
    leftBlock.append(stars);

    let exit = document.createElement('button');
    exit.classList.add('exit');

    section.append(leftBlock);
    section.append(exit);
    fragment.append(section);

    newBlock.append(fragment);

    exit.addEventListener('click', () => {
        section.remove();
    });
}