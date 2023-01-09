/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
//const todo = require("../models/todo");
let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo test suite ", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("creating a new todo test /todos", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302); //http status code
  });
  test("Mark todo as a completed (updating todo)", async () => {
var res = await agent.get("/todos");
var csrfToken = getCsrfToken(res);
await agent.post("/todos").send({
title: "play cricket",
dueDate: new Date().toISOString(),
_csrf: csrfToken,
});

const Todos = await agent.get("/todos").set("Accept", "application/json");
const parseTodos = JSON.parse(Todos.text);
const countTodaysTodos = parseTodos.dueToday.length;
const Todo = parseTodos.dueToday[countTodaysTodos - 1];
var status = true;
res = await agent.get("/todos");
csrfToken = getCsrfToken(res);


const changeTodo = await agent
.put(`/todos/${Todo.id}`)
.send({ _csrf: csrfToken, completed: status });

const parseUpadteTodo = JSON.parse(changeTodo.text);
expect(parseUpadteTodo.completed).toBe(true);
});
test("Mark todo as incompleted (updating todo)", async () => {
var res = await agent.get("/todos");
var csrfToken = getCsrfToken(res);

//using previous used test case status
const Todos = await agent.get("/todos").set("Accept", "application/json");
const parseTodos = JSON.parse(Todos.text);
const countTodaysTodos = parseTodos.dueToday.length;
const Todo = parseTodos.dueToday[countTodaysTodos - 1];
const status = false;

const changeTodo = await agent
.put(`/todos/${Todo.id}`)
.send({ _csrf: csrfToken, completed: status });

const parseUpadteTodo = JSON.parse(changeTodo.text);
expect(parseUpadteTodo.completed).toBe(false);
});


  test("Deleting todo test", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedTodosResponse.dueToday.length;
    const newTodo = parsedGroupedTodosResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const deleteTodo = await agent
      .delete(`/todos/${newTodo.id}`)
      .send({ _csrf: csrfToken });

    const deleteTodoResponse = JSON.parse(deleteTodo.text);
    console.log(deleteTodoResponse);
    expect(deleteTodoResponse).toBe(true);
  });
});
