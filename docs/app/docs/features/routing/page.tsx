import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Routing() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Routing</h1>
        <p className="text-lg">
          Routing in MetaRoute allows you to define and manage API routes for
          handling incoming requests. It provides both RESTful and event-based
          routing mechanisms to support different types of applications and use
          cases.
        </p>
      </DocsSection>

      <DocsSection id="http">
        <DocsHeader text="HTTP" />
        <p className="text-lg">
          RESTful routing in MetaRoute follows the principles of REST
          (Representational State Transfer) architecture and allows you to
          define CRUD (Create, Read, Update, Delete) operations for resources in
          your API. It provides a structured and standardized way to design and
          implement APIs for web applications.
        </p>
        <p className="text-lg mt-4">
          RESTful routing simplifies the development process by providing clear
          guidelines for defining endpoints, handling requests, and managing
          resources, making it easier to build scalable and maintainable APIs.
        </p>
        <DocsCode>
          {`import { Controller, Get, Post, Delete, Put, Body } from "@emilohlund-git/metaroute";

@Controller("/api/posts")
export class PostController {
  @Get("/")
  async getPosts() {
    // Retrieve and return list of posts
  }

  @Get("/:id")
  async getPostById(id: string) {
    // Retrieve and return post by ID
  }

  @Post("/")
  async createPost(@Body() postData: any) {
    // Create a new post
  }

  @Put("/:id")
  async updatePost(@Body() postData: any, id: string) {
    // Update an existing post
  }

  @Delete("/:id")
  async deletePost(id: string) {
    // Delete an existing post
  }
}`}
        </DocsCode>
      </DocsSection>

      <DocsSection id="event">
        <DocsHeader text="Event" />
        <p className="text-lg">
          Event routing in MetaRoute enables you to handle real-time events and
          messages using WebSocket connections. It allows you to define event
          handlers for specific events and broadcast messages to connected
          clients in real-time.
        </p>
        <p className="text-lg mt-4">
          Event routing is useful for building applications that require
          bi-directional communication between the client and server, such as
          chat applications, real-time dashboards, and multiplayer games.
        </p>
        <DocsCode>
          {`import { SocketController, OnMessage } from "@emilohlund-git/metaroute";

@SocketController("chat")
export class ChatController {
  @OnMessage("message")
  async handleMessage(data: any, socket: Socket) {
    // Handle incoming message
    console.log("Received message:", data);
    // Broadcast message to all connected clients
    socket.broadcast.emit("message", data);
  }
}`}
        </DocsCode>
      </DocsSection>
    </DocsContainer>
  );
}
