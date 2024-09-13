# GONAD Starter - A Hypermedia Application Starter Template

# Stack

- [Go](https://go.dev/doc/)
- [NATS](https://docs.nats.io/)
- [Air](https://github.com/air-verse/air)
- [Datastar](https://github.com/delaneyj/datastar)
- [Templ](https://templ.guide/)
  - [Tailwind](https://tailwindcss.com/) x [DaisyUI](https://daisyui.com/) x [esbuild](https://esbuild.github.io/)

# Setup

1. Clone repo

```shell
git clone https://github.com/zangster300/gonad-starter.git
```

2. install dependencies

```shell
go mod tidy
go install github.com/a-h/templ/cmd/templ@latest
pnpm install
```

3. create 🚀

# Development

Using [taskfile.dev](https://taskfile.dev/)

```shell
task live
```

Navigate to [`http://localhost:7331`](http://localhost:7331) in your favorite web browser to begin

[Source for hot-reload setup](https://templ.guide/commands-and-tools/live-reload-with-other-tools#putting-it-all-together)

## IDE Support

- [Templ / TailwindCSS Support](https://templ.guide/commands-and-tools/ide-support)

# Contributing

Completely open to PR's and feature requests but you'll move faster by forking and building out your own application

# References

## Server

- [go](https://go.dev/)
- [nats](https://docs.nats.io/)
- [datastar](https://datastar.fly.dev/)
- [templ](https://templ.guide/)
  - NOTE: the TODO example relies on the [`TEMPL_EXPERIMENT=rawgo`](https://templ.guide/syntax-and-usage/raw-go/) environment variable until it makes it's way as a main feature

## Client

- [tailwindcss](https://tailwindcss.com/)
- [daisyui](https://daisyui.com/)
- [esbuild](https://esbuild.github.io/)

## Hypermedia Architecture

- [Hypermedia-Driven Applications](https://htmx.org/essays/hypermedia-driven-applications/)
- [HTMX Sucks](https://htmx.org/essays/htmx-sucks/)
- [HTMX Sucks (kinda)](https://datastar.fly.dev/essays/htmx_sucks)
- [Streams All the Way Down](https://datastar.fly.dev/essays/event_streams_all_the_way_down)
