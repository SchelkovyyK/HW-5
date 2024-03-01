class Card {
  constructor(res) {
    this.res = res;
    this.createCard();
  }
  createCard() {
    let div = document.createElement("div");
    div.setAttribute("id", `${this.res.id}`);
    div.innerHTML = `
    <button class="delete_button" id="${this.res.id}">X</button>
    <h2>${this.res.user.username}</h2>
    <h3>${this.res.user.name}</h3>
    <p>${this.res.title}</p>
    <p>${this.res.body}</p>
    <h6>${this.res.user.email}</h6>
    `;
    document.getElementById("root").appendChild(div);
  }
}

const get1 = fetch("https://ajax.test-danit.com/api/json/users", {
  method: "GET",
});
const get2 = fetch("https://ajax.test-danit.com/api/json/posts", {
  method: "GET",
});
Promise.all([get1, get2])
  .then((data) => {
    return Promise.all(data.map((res) => res.json())).then((delta) => {
      const users = delta[0];
      const posts = delta[1];
      console.table(users);
      console.table(posts);
      const combinedData = posts.map((post) => {
        const user = users.find((u) => u.id === post.userId);
        return { ...post, user };
      });
      combinedData.forEach((res) => {
        new Card(res)
      });
    });
  })
  .then(() => {
    const buttons = document.querySelectorAll(".delete_button");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const postId = e.target.id;
        fetch(`https://ajax.test-danit.com/api/json/posts/${postId}`, {
          method: "DELETE",
        }).then((data) => {
          console.log(data);
          const divToRemove = document.getElementById(postId);
          if (divToRemove) {
            divToRemove.remove();
          }
        });
      });
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
