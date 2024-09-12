# run templ generation in watch mode to detect all .templ files and 
# re-create _templ.txt files on change, then send reload event to browser. 
# Default url: http://localhost:7331
live/templ:
	templ generate --watch --proxy="http://localhost:8080" --open-browser=false -v

# run tailwindcss to generate the styles bundle in watch mode.
live/styles:
	pnpx tailwindcss -c tailwind.config.js -i views/styles/styles.css -o static/index.css --watch

# run esbuild to generate the js bundle in watch mode.
live/esbuild:
	pnpx esbuild views/ts/index.ts --bundle --outdir=static/ --watch

# run air to detect any go file changes to re-build and re-run the server.
live/server:
	go run github.com/air-verse/air@v1.52.3 \
	--build.cmd "go build -tags dev -o tmp/bin/main" \
	--build.bin "tmp/bin/main" \
	--build.delay "20" \
	--build.exclude_dir "node_modules,data,public" \
	--build.include_ext "go" \
	--build.stop_on_error "false" \
	--misc.clean_on_exit true

# watch for any js or css change in the static/ folder, then reload the browser via templ proxy.
live/sync_static:
	go run github.com/air-verse/air@v1.52.3 \
	--build.cmd "templ generate --notify-proxy" \
	--build.bin "true" \
	--build.delay "100" \
	--build.exclude_dir "" \
	--build.include_dir "static" \
	--build.include_ext "js,css"

# start all watch processes in parallel.
live: 
	make -j5 live/templ live/server live/styles live/esbuild live/sync_static


run: build
	@./bin/main

build:
	go build -o bin/main .