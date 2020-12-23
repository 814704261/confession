let home = {
    count: 0,
    xhr: new XMLHttpRequest(),
    init: function() {
        this.content = document.querySelector('.content');
        this.request('/home', undefined, undefined);
        this.search();
        this.effects();
        this.select();
        this.content.addEventListener('scroll', this.scroll.bind(this));
    },
    request: function(url, value, flag) {

        this.xhr.open('post', url);
        this.xhr.setRequestHeader('content-type', 'application/json');
        if (value) {
            this.xhr.send(JSON.stringify({
                search: value
            }));
        } else if (flag) {
            this.xhr.send(JSON.stringify({
                flag: flag
            }));
        } else {
            this.xhr.send(JSON.stringify({
                count: this.count
            }));
        }

        let that = this;
        this.xhr.onload = function() {
            let res = JSON.parse(this.responseText);
            if (value || flag) {
                if (res.length == 0) {
                    alert('没有查询到');
                    return;
                } else {
                    that.content.innerHTML = '';
                    that.content.removeEventListener('scroll', that.scroll);
                }
            } else {
                that.count += res.length;
            }
            console.log(res);
            
            for (let x of res) {
                let div = document.createElement('div');
                div.className = 'card';
                if (x.anonymous) {
                    div.innerHTML = `<div class="contenthead">
                    <img src="${x.avatar}" alt="" class="avatar">
                    <div class= "name-sch">
                      <p class="id">匿名</p>
                      <span class="hospital">${x.school}</span>
                    </div>
                    <span class="good" id="${x.loveId}">
                        <i class="iconfont icon-aixin"></i>
                        <span class="star">${x.good}</span>
                    </span>
                    </div>`;
                } else {
                    div.innerHTML = `<div class="contenthead">
                    <img src="${x.avatar}" alt="" class="avatar">
                    <div class= "name-sch">
                     <p class="id">${x.yourName}</p>
                     <span class="hospital">${x.school}</span>
                    </div>
                    <span class="good" id="${x.loveId}">
                        <i class="iconfont icon-aixin"></i>
                        <span class="star">${x.good}</span>
                    </span>
                    </div>`;
                }
                if (x.img.length > 0) {
                    div.innerHTML += `
                <div>
                    <a href="/content/${x.loveId}" class="allcontent">
                            <div class="contents">
                            <h2 class="title">${x.title}</h2>
                            <div class="words">
                                <span>${x.section}</span>
                            </div>
                    </a>

                    <div class="cardimg">
                        <img src="${x.img[0]}" alt="">
                    </div>
                    
                </div>`;
                } else {
                    div.innerHTML += `
                <div>
                    <a href="/content/${x.loveId}" class="allcontent">
                            <div class="contents">
                            <h2 class="title">${x.title}</h2>
                            <div class="words">
                                <span>${x.section}</span>
                            </div>
                    </a>
                </div>`;
                }


                that.content.appendChild(div);

                let good = document.getElementById(x.loveId);
                good.onclick = that.starChange.bind(good, that);
            }
        };
    },
    scroll: function() { //懒加载功能
        clearTimeout(this.content.timer);
        this.content.timer = setTimeout(() => {
            if (this.content.scrollTop + this.content.offsetHeight === this.content.scrollHeight) {
                this.request('/home', undefined, undefined);
            }
        }, 700);
    },
    starChange: function(that) { //点亮小爱心功能
        clearTimeout(this.timer);
        let i = this.querySelector('i');
        let span = this.querySelector('span');
        let id = this.id;
        this.timer = setTimeout(function() {

            let temp = Number(span.innerHTML);

            if (i.className == 'iconfont icon-aixin') {
                i.className += ' yes';
                span.innerHTML = temp + 1;
                that.starAjax.call(that, true, id);
            } else {
                i.className = 'iconfont icon-aixin';
                span.innerHTML = temp - 1;
                that.starAjax.call(that, false, id);
            }
            i.style.animationPlayState = 'running';
        }, 600);

    },
    starAjax: function(or, id) {
        this.xhr.open('post', '/star');
        this.xhr.setRequestHeader('content-type', 'application/json');
        this.xhr.onload = function() {
            let res = JSON.parse(this.responseText);
            if (!res.state) {
                return alert('网络不佳，稍后再试');
            }
        };
        if (or) {
            this.xhr.send(JSON.stringify({
                state: true,
                loveId: id
            }));
        } else {
            this.xhr.send(JSON.stringify({
                state: false,
                loveId: id
            }));
        }
    },
    search: function() {
        let input = document.querySelector('.search').querySelector('input');
        let btn = document.querySelector('.search').querySelector('button');
        let that = this;
        btn.onclick = function() {
            if (input.value.trim() == '') {
                alert('搜索的内容不可为空');
                return;
            }
            that.request('/search', input.value);
        };
    },
    effects: function() {
        let sort = document.querySelector('.sort');
        let sortLen = sort.children.length;

        for (let i = 0; i < sortLen; i++) {
            sort.children[i].onclick = function() {
                sort.children[0].className = '';
                sort.children[1].className = 'anonymous';
                sort.children[2].className = 'man';
                sort.children[3].className = 'girl';
                this.className = 'selected';
                this.style.animationPlayState = 'running';
            }
        }
    },
    select: function() {
        let sort = document.querySelector('.sort');
        sort.addEventListener('click', (e) => {
            let target = e.target;
            if (target === sort) {
                return;
            }
            let flag = target.getAttribute('data-sort');
            this.request('/sort', undefined, flag);
        });
    }
};


home.init();