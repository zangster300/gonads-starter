# Purpose

This directory holds the templating for your website using [Templ](https://templ.guide/)

# Organization

These `.templ` files have been organized with composability in mind.

Feel free to move around anything in here as you see fit!

> [!WARNING]  
> If any pathing is updated, make sure to update the paths across scripts in the `package.json` and `Taskfile.yml` files

## Components

This directory holds reusable component templates that can be composed across different page layouts

## Layouts

This directory is responsible for different layouts across web pages of your site

## Pages

This directory is responsible for the different pages accessible through your site

## Styles

This directory is responsible for your website's styling, it is currently setup to rely on [TailwindCSS](https://tailwindcss.com/)

## TypeScript / JavaScript

This directory serves as an optional entrypoint to be used for storing any custom JS/TS you may need for your project to run.

Currently it is being used to run DATASTAR in offline mode

### Bundling

[esbuild](https://esbuild.github.io/)

Scripts for bundling are found in the following locations

- [package.json](../../package.json)
- [taskfile.yml](../../Taskfile.yml)

