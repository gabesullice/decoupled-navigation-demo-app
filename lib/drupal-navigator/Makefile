default: pretty pack

pack: node_modules
	npx rollup -c

pretty: node_modules
	npx prettier --write src

node_modules:
	npm install
