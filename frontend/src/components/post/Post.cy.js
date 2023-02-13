import Post from "./Post";

describe("Post", () => {
  it("renders a post with a message", () => {
    cy.mount(<Post post={{ _id: 1, message: "Hello, world" }} />);
    cy.get('[data-cy="post"]').should("contain.text", "Hello, world");
  });
});

// describe("Post component", () => {
//   it("renders post message and deletes post", () => {
//     const post = { _id: 1, message: "Test post message" };
//     const setPosts = cy.stub();
//     const posts = [post];
//     const token = "test-token";

//     cy.server();
//     cy.route({
//       method: "DELETE",
//       url: `/posts/1`,
//       status: 200,
//       response: {}
//     }).as("deletePost");

//     cy.mount(<Post post={post} setPosts={setPosts} posts={posts} token={token} />);
//     cy.get('[data-cy="post"]').contains("Test post message");
//     cy.get("button").click();
//     cy.wait("@deletePost");
//     cy.wrap(setPosts).should("be.calledWith", []);
//   });
// });

// it("delete a post", () => {
//   cy.mount(<Post post={{ _id: 1, message: "Hello, world" }} />);
//   cy.mount(<Post post={{ _id: 2, message: "Hi, everyone" }} />);
//   cy.get('[data-cy="post"]').should(
//     "contain.text",
//     "Hello, world",
//     "Hi, everyone"
//   );
//   cy.delete(<Post post={{ _id: 2, message: "Hi, everyone" }} />);
//   cy.get('[data-cy="post"]').should("contain.text", "Hello, world");
// });
