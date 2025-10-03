SHELL=/bin/bash

.PHONY: help validate_code

help:
	    @echo "Makefile commands:"
	    @echo "validate_code: run fmt, ruff, pylint and tests."

.DEFAULT_GOAL := validate_code

install:
	pnpm install

upgrade:
	pnpm self-update

lint:
	pnpm run lint

typecheck:
	pnpm run typecheck

fix:
	pnpm run lint:fix

format:
	pnpm run format

check_format:
	pnpm run format:check

test:
	pnpm run test

validate_code: format fix typecheck test

clean:
	pnpm run clean

build:
	pnpm run build
