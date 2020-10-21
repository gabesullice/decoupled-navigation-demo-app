default: pretty pack

all: libs pack

pack: .env.js node_modules
	npx webpack

pretty: node_modules
	npx prettier --write src

libs:
	for lib in $(shell ls -d $$PWD/lib/*); do \
		pushd $$lib && make pack && popd; \
	done

node_modules:
	npm install

.env.js:
	if ! test -e .env.js; then cp .default.env.js $@; fi
