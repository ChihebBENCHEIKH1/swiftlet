# 🕊️ Swiftlet

**Swiftlet** is a lightweight and flexible Node.js web framework for handling HTTP requests, dynamic routing, query parsing, and request bodies with minimal overhead.  
Ideal for building small to medium APIs and web apps while giving you full control over the request lifecycle.

## ✨ Features

- Clean, intuitive routing with dynamic parameters support
- Built-in query parsing and request body handling
- Customizable CORS support
- Minimalistic design optimized for performance
- Debug logging for easy request tracking

## 📦 Installation

```bash
npm install @chiheb_ben_cheikh/swiftlet
```
## 🚀 Quick Start

```js

import SwiftletModule from '@chiheb_ben_cheikh/swiftlet';
const Swiftlet = SwiftletModule.default;

const app = new Swiftlet(8080, '*', '127.0.0.1', true);

app.route({
  endpoint: '/',
  method: 'GET',
  response: (req) => ({
    statusCode: 200,
    json: { message: 'Hello, world!' }
  }),
});

app.route({
  endpoint: '/user/:id',
  method: 'GET',
  response: (req) => ({
    statusCode: 200,
    json: { userId: req.param('id') }
  }),
});

```
