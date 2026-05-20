export default {
  async fetch(request, env) {
    return env.MyDatabase.fetch(request);
  }
}

export class MyDatabase {
  constructor(state, env) {
    this.state = state;
    this.storage = state.storage; // acts like a table
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