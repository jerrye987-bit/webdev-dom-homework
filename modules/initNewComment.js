import { sanitizeHtml } from "./sanitizeHtml.js";
import { comments } from "./commentsArr.js";
import { renderComments } from "./renderComments.js";
import { text } from "./renderComments.js";
import { name } from "./renderComments.js";


export const initNewComment = () => {
      const addButton = document.querySelector(".add-form-button");
      
      addButton.addEventListener('click', () => {
        const newComment = {
          name: sanitizeHtml(name.value),
          date: new Date(),
          text: sanitizeHtml(text.value),
          likes: 0,
          isLiked: false
        };
          
        if (name.value.trim() === "" || text.value.trim() === "") {
          return alert("Пожалуйста, заполните все поля формы!")
        } else {
          comments.push(newComment);

          renderComments();

          name.value = "";
          text.value = "";
        }
      })
    }