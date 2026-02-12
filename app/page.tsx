"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { sendAPNSNotification } from "./actions"; // Importeer de server actie

Amplify.configure(outputs);

const client = generateClient<Schema>();



export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  async function handlePush() {
    console.log("handlePush() aangeroepen");
    try {
      const result = await sendAPNSNotification("66963c76a37be0378fb649dbdda2b483cda9a7d9b2dea1663b7f2fe6b5cfef91");
      console.log(result);
    } catch (e) {
      console.error("Client-side error:", e);
    }
  }


  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <div>
        <button onClick={handlePush}>Verstuur Push</button>
      </div>
    </main>
  );
}


     