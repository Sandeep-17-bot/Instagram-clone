import React from 'react';
import '../css/post.css';
import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react'
import { db } from '../firebase';
import firebase from 'firebase'
function Post({ username, user, postId, caption, imageUrl }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        }
    }, [postId])
    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('');
    }
    return (
        <div className='post'>
            <div className="post__header">
                <Avatar className='post__avatar' alt="Sandeep" src='https://pbs.twimg.com/profile_images/1214495220328349696/eQgYYrwQ_400x400.jpg' />
                <h3>{username}</h3>
            </div>
            <img className='post__image' src={imageUrl} alt="" />
            <h4 className='post__text'><strong>{username}: </strong>{caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (

                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            {user && (

                <form className="post__commentBox">
                    <input
                        type="text"
                        className='post__input'
                        placeholder='Add a comment...'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <button
                        className='post__button'
                        disabled={!comment}
                        type='submit'
                        onClick={postComment}
                    >Post</button>
                </form>
            )}
        </div>
    )
}

export default Post
