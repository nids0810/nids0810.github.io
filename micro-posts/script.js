
//const url = 'articles.json';
const url = 'posts.json';
var currentPost;
var currentPostNum = 0;
var posts;
var Reply = {"isReply": false, "currObj": {}};

function getPostList(num) {
    fetch(url)
    .then(function(response){
        if(response.ok){
            return response.json();
        }
        return Promise.reject('API error ' + response.status);
    }).then(function(data){
        if(localStorage.getItem('posts') === null) {
            localStorage.setItem('posts', JSON.stringify(data.posts));
            posts = data.posts;
        } else {
            posts = JSON.parse(localStorage.getItem('posts'));
        }

        currentPost = posts[num];

        document.getElementById('articleTitle').innerHTML = currentPost.title;
        document.getElementById('articleContent').innerHTML = currentPost.content;

        // for comments
        if(currentPost.comments === undefined) {
            currentPost.comments = [];
            resetComments();
        } else if(currentPost.comments.length === 0) {
            resetComments();
        } else {
            showAllComments(currentPost.comments);
        }

        // for page navigation
        if(num === 0) {
            document.getElementById('previous').classList.add('disable');
            document.getElementById('previous').classList.remove('active');
        } else {
            document.getElementById('previous').classList.remove('disable');
            document.getElementById('previous').classList.add('active');
        }
        if(num === posts.length - 1) {
            document.getElementById('next').classList.add('disable');
            document.getElementById('next').classList.remove('active');
        } else {
            document.getElementById('next').classList.remove('disable');
            document.getElementById('next').classList.add('active');
        }
    }).catch(function(error){
        console.log(error);
    });
}

//Entry point
getPostList(currentPostNum);

function next() {
    currentPostNum = currentPostNum + 1;
    getPostList(currentPostNum);
}

function prev() {
    currentPostNum = currentPostNum - 1;
    getPostList(currentPostNum);
}

function checkInput() {
    if(document.getElementById('username').value !== '' && document.getElementById('usercomment').value !== '') {
        document.getElementById('addBtn').classList.remove('disable');
    }
}

function addComment() {
    var commentObj = {};
    var inputName = document.getElementById('username').value;
    var inputComment = document.getElementById('usercomment').value;
    commentObj.username = inputName;
    commentObj.userComment = inputComment;
    commentObj.like = false;
    if(Reply.isReply) {
        commentObj.replyto = Reply.currObj;
    } else {
        commentObj.replyto = null;
    }
    currentPost.comments.push(commentObj);

    var currPostIndex = posts.indexOf(currentPost);
    posts.splice(currPostIndex, 1, currentPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    var commentConatiner = document.getElementById('commentConatiner');
    //added comment count
    if(currentPost.comments.length === 1) {
        var h3 = document.createElement('h3');
        h3.setAttribute('id', 'commentCount');
        commentConatiner.appendChild(h3);
    }
    document.getElementById('commentCount').innerHTML = currentPost.comments.length + ' Comment';
    
    //added comment box
    var div = document.createElement('div');
        div.setAttribute('class', 'commentBox');
        commentConatiner.appendChild(div);
        div.innerHTML = '<div>'+
        '<div class="user">' +
            '<div class="userDetails pullLleft">' +
                '<span class="icon fa fa-user-circle"></span>' +
                '<span id="userName">'+commentObj.username+'</span>' +
            '</div>' +
            '<div class="commentIcons pullRight">' +
            '<span class="reply fa fa-reply"></span>'+
                '<span class="copy fa fa-clipboard"></span>' +
                '<span class="likes fa fa-heart"></span>' +
                '<span class="deletepost fa fa-trash-alt"></span>' +
            '</div>' +
            '<div class="clear"></div>' +
        '</div>' +
        '<div id="commentGiven">'+ commentObj.userComment +'</div>' +
    '</div>';
    if(Reply.isReply){
        div.querySelector('#commentGiven').innerHTML = 'replied <<< ' + commentObj.userComment;
        resetReply();
    }

    div.getElementsByClassName('deletepost')[0].onclick = function() {
        deletePost(this, commentObj);
    }
    div.getElementsByClassName('likes')[0].onclick = function() {
        likePost(this, commentObj);
    }
    div.getElementsByClassName('copy')[0].onclick = function() {
        copyToClipboard(this, commentObj);
    }
    div.getElementsByClassName('reply')[0].onclick = function() {
        replyTo(this, commentObj);
    }

    document.getElementById('beTheFirst').classList.add('hide');
    document.getElementById('username').value = '';
    document.getElementById('usercomment').value = '';
    document.getElementById('addBtn').classList.add('disable');
}

function replyTo(ele, obj) {
    changeFocus();
    Reply.isReply = true;
    Reply.currObj = obj;
}

function changeFocus() {
    document.getElementById('username').focus();
}

function copyToClipboard(ele, obj) {
  var text = obj.userComment + ' by: ' + obj.username;
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function likePost(ele, obj) {
    if(obj.like) {
        obj.like = false;
        ele.classList.remove('heart');
    } else {
        obj.like = true;
        ele.classList.add('heart');
    }
    
    localStorage.setItem('posts', JSON.stringify(posts));
}

function deletePost(ele, obj) {
    ele.closest('.commentBox').remove();
    var index = currentPost.comments.indexOf(obj);
    currentPost.comments.splice(index, 1);

    var currPostIndex = posts.indexOf(currentPost);
    posts.splice(currPostIndex, 1, currentPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    if(currentPost.comments.length === 0) {
        resetComments();
    } else {
        document.getElementById('commentCount').innerHTML = currentPost.comments.length + ' Comment';
    }
}

function resetComments() {
    currentPost.comments = [];
    document.getElementById("commentConatiner").innerHTML = "";
    document.getElementById("beTheFirst").classList.remove("hide");
    document.getElementById('username').value = '';
    document.getElementById('usercomment').value = '';
    document.getElementById('addBtn').classList.add('disable');
}

function showAllComments(comments) {
    var commentConatiner = document.getElementById('commentConatiner');
    commentConatiner.innerHTML = '';

    //added comment count
    var h3 = document.createElement('h3');
    h3.setAttribute('id', 'commentCount');
    commentConatiner.appendChild(h3);
    h3.innerHTML = comments.length + ' Comment';

    //added comment boxes
    for(let item of comments) {
        var div = document.createElement('div');
        div.setAttribute('class', 'commentBox');
        commentConatiner.appendChild(div);
        div.innerHTML = '<div>'+
        '<div class="user">' +
            '<div class="userDetails pullLleft">' +
                '<span class="icon fa fa-user-circle"></span>' +
                '<span id="userName">'+item.username+'</span>' +
            '</div>' +
            '<div class="commentIcons pullRight">' +
            '<span class="reply fa fa-reply"></span>'+
                '<span class="copy fa fa-clipboard"></span>' +
                '<span class="likes fa fa-heart"></span>' +
                '<span class="deletepost fa fa-trash-alt"></span>' +
            '</div>' +
            '<div class="clear"></div>' +
        '</div>' +
        '<div id="commentGiven">'+ item.userComment +'</div>' +
        '</div>';
        div.getElementsByClassName('deletepost')[0].onclick = function() {
            deletePost(this, item);
        }
        div.getElementsByClassName('likes')[0].onclick = function() {
            likePost(this, item);
        }
        div.getElementsByClassName('copy')[0].onclick = function() {
            copyToClipboard(this, item);
        }
        if(item.like) {
            div.getElementsByClassName('likes')[0].classList.add('heart');
        }
        div.getElementsByClassName('reply')[0].onclick = function() {
            replyTo(this, item);
        }
        if(item.replyto !== undefined && item.replyto !== null){
            div.querySelector('#commentGiven').innerHTML = 'replied <<< ' + item.userComment;
            resetReply();
        }
   }

    document.getElementById('beTheFirst').classList.add('hide');
    document.getElementById('username').value = '';
    document.getElementById('usercomment').value = '';
    document.getElementById('addBtn').classList.add('disable');
}

function resetReply() {
    Reply = {"isReply": false, "currObj": {}};
}