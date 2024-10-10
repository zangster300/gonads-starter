# GONADS Starter - A Hypermedia Application Starter Template

# Stack

- [Go](https://go.dev/doc/)
- [NATS](https://docs.nats.io/)
- [Air](https://github.com/air-verse/air)
- [Datastar](https://github.com/delaneyj/datastar)
- [Templ](https://templ.guide/)
  - [Tailwind](https://tailwindcss.com/) x [DaisyUI](https://daisyui.com/) x [esbuild](https://esbuild.github.io/)

# Setup

1. Clone this repository

```shell
git clone https://github.com/zangster300/gonads-starter.git
```

2. Install Dependencies

```shell
go mod tidy
go install -v github.com/go-delve/delve/cmd/dlv@latest
pnpm install
```

3. Create 🚀

# Development

Using the [taskfile](https://taskfile.dev/)

```shell
task live
```

Navigate to [`http://localhost:7331`](http://localhost:7331) in your favorite web browser to begin

[Source for hot-reload setup](https://templ.guide/commands-and-tools/live-reload-with-other-tools#putting-it-all-together)

## Debugging

A task has been created that will launch [delve](https://github.com/go-delve/delve) to begin a debugging session with your project's binary

```shell
task debug
```

Alternatively, a `Debug Main` configuration has been added to the [launch.json](./.vscode/launch.json) file

## IDE Support

- [Templ / TailwindCSS Support](https://templ.guide/commands-and-tools/ide-support)

### Visual Studio Code Integration

[Reference](https://code.visualstudio.com/docs/languages/go)

- [launch.json](./.vscode/launch.json)
- [settings.json](./.vscode/settings.json)

# Contributing

Completely open to PR's and feature requests but you'll move faster by forking and building out your own application

# References

## Server

- [go](https://go.dev/)
- [nats](https://docs.nats.io/)
- [datastar](https://datastar.fly.dev/)
- [templ](https://templ.guide/)

> [!IMPORTANT]  
> The `TODO` example relies on the [`TEMPL_EXPERIMENT=rawgo`](https://templ.guide/syntax-and-usage/raw-go/) environment variable being set

## Client

- [tailwindcss](https://tailwindcss.com/)
- [daisyui](https://daisyui.com/)
- [esbuild](https://esbuild.github.io/)

## Hypermedia Architecture

- [Hypermedia-Driven Applications](https://htmx.org/essays/hypermedia-driven-applications/)
- [HTMX Sucks](https://htmx.org/essays/htmx-sucks/)
- [HTMX Sucks (kinda)](https://datastar.fly.dev/essays/htmx_sucks)
- [Streams All the Way Down](https://datastar.fly.dev/essays/event_streams_all_the_way_down)
