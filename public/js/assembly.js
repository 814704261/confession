let gender = document.getElementById('gender');
let girl = document.getElementById('girl');
gender.addEventListener('input', function() {
    this.nextElementSibling.className = 'genderbox';
});

girl.addEventListener('input', function() {
    this.nextElementSibling.classList.add('girl');
});

let anonymous = document.getElementById('anonymous');
let nobox = document.getElementById('nobox');
anonymous.addEventListener('input', function() {
    this.nextElementSibling.className = 'box';
});

nobox.addEventListener('input', function() {
    this.nextElementSibling.classList.add('noBox');
});

// 返回上一页
function back() {
    history.back();
}
var backp = document.querySelector('.release');
backp.addEventListener('click', back)