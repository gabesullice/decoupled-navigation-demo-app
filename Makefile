default: pretty pack

pack: .env.js
	npx webpack

pretty:
	npx prettier --write src

.env.js:
	if ! test -e .env.js; then cp .default.env.js $@; fi
