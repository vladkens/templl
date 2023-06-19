all:
	@echo hi

install:
	yarn build && npm i -g .

remove:
	npm uninstall -g templl

test-install:
	make install
	rm -rf abc && templl vladkens/react-template abc
