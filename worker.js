export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = env.MyDatabase.idFromName("main");
    const obj = env.MyDatabase.get(id);

    // Serve index.html at root
    if (url.pathname === "/") {
      return new Response(await fetch("https://your-cloudflare-pages-site.pages.dev"), {
        headers: { "content-type": "text/html" }
      });
    }

    // Forward other routes to Durable Object
    return obj.fetch(request);
  }
}

export class MyDatabase {
  constructor(state, env) {
    this.storage = state.storage;
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/add") {
      const { name, email } = await request.json();
      await this.storage.put(name, { email });
      return new Response("Added successfully");
    }
    if (url.pathname === "/list") {
      const entries = await this.storage.list();
      return new Response(JSON.stringify([...entries.values()]));
    }
    return new Response("Not found", { status: 404 });
  }
}
