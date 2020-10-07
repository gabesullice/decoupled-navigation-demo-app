default: pretty pack

pack:
	npx webpack

pretty:
	npx prettier --write src
