let submit = {

    init: function() {
        this.avatars = ['/Image/headlogo.jpg', '/Image/1.jpg', '/Image/2.jpg', '/Image/3.jpg', '/Image/4.jpg', '/Image/5.jpg', '/Image/6.jpg'];
        this.btn = document.getElementById('submit');
        this.title = document.getElementById('title');
        this.taName = document.getElementById('taName');
        this.anonymous = document.getElementById('anonymous');
        this.yourName = document.getElementById('yourName');
        this.gender = document.getElementById('gender');
        this.section = document.getElementById('section');
        this.school = document.getElementById('school');
        this.file = document.getElementById('file');
        this.img = [];
        this.xhr = new XMLHttpRequest();

        this.btn.onclick = this.sent.bind(this);
        this.file.onchange = this.updata.bind(this);
    },
    sent: function() {

        if (!this.judgement()) {
            return;
        }
        let newTime = this.time();
        let fd = new FormData();
        fd.append('time', newTime);
        fd.append('loveId', newTime);
        fd.append('title', this.title.value);
        fd.append('taName',this.taName.value);
        fd.append('yourName',this.yourName.value);
        fd.append('anonymous', !(this.anonymous.checked));
        fd.append('gender',this.gender.checked);
        fd.append('section',this.section.value);
        fd.append('good',0);
        fd.append('school',this.school.value);
        fd.append('avatar',this.avatar());
        for(let i = 0;i < this.img.length;i ++){
            let name = 'file' + i;
            fd.append(name,this.img[i]);
        }

        console.log(fd);

        this.xhr.open('post','/love');
        this.xhr.upload.onprogress = function(){
            console.log('aaaaa');
        };
        this.xhr.send(fd);

        this.xhr.onload = function() {
            let res = JSON.parse(this.responseText);
            console.log(res.state);
            if (res.state) {
                window.location.href = '/index.html';
            } else {
                alert('网络不佳，请稍后再试');
            }
        };


        // this.xhr.open('post', '/love');
        // this.xhr.setRequestHeader('content-type', 'application/json');
        // this.xhr.send(JSON.stringify({
        //     time: this.time(),
        //     loveId: this.time(),
        //     title: this.title.value,
        //     taName: this.taName.value,
        //     yourName: this.yourName.value,
        //     anonymous: !(this.anonymous.checked),
        //     gender: this.gender.checked,
        //     section: this.section.value,
        //     img: this.img,
        //     good: 0,
        //     school: this.school.value,
        //     avatar: this.avatar()
        // }));
        // this.xhr.onload = function() {
        //     let res = JSON.parse(this.responseText);
        //     console.log(res.state);
        //     if (res.state) {
        //         window.location.href = '/index.html';
        //     } else {
        //         alert('网络不佳，请稍后再试');
        //     }
        // };
    },
    judgement: function() {
        if (this.title.value.trim() === '' || this.title.value.trim().length < 1) {
            alert('标题不能低于一个字符');
            return false;
        }
        if (this.taName.value.trim() === '' || this.taName.value.trim().length < 1) {
            alert('ta的名字不能低于一个字符');
            return false;
        }
        if (this.yourName.value.trim() === '' || this.yourName.value.trim().length < 1) {
            alert('你的名字不能低于一个字符');
            return false;
        }
        if (this.section.value.trim() === '' || this.section.value.trim().length < 1) {
            alert('你对ta的爱就这么少吗');
            return false;
        }
        if (this.school.value.trim() === '' || this.school.value.trim().length < 2) {
            alert('学校名字不能低于两个字符');
            return false;
        }
        return true;
    },
    updata: function() {
        if(this.img.length === 9){
            return alert('最多可上传9张图片');
        }
        this.img.push(this.file.files[0]);
        let picture = document.querySelector('.picture');
        let div = document.createElement('div');
        div.className = 'exhibition';
        div.innerHTML = `<img src="${window.URL.createObjectURL(this.file.files[0])}" >`;
        picture.append(div);
    },
    time: function() {
    	return new Date().getTime();
        // let date = new Date();
        // return '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
    },
    avatar: function() {
        let temp = Math.random() * this.avatars.length - 1;
        temp = temp <= 0 ? 0 : Math.ceil(temp);
        return this.avatars[temp];
    }
};

submit.init();